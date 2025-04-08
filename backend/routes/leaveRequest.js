const express = require('express');
const router = express.Router();
const supabase = require('../db');
const { v4: uuidv4 } = require('uuid');
const { InferenceClient } = require("@huggingface/inference");

const hf = new InferenceClient("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");

// 🟢 Submit Leave Request (Employee)
router.post('/', async (req, res) => {
  const { empid, reason, from_date, to_date } = req.body;

  const { data, error } = await supabase
    .from('Request')
    .insert([{
      leaveId: uuidv4(),
      empid,
      Username,
      role,
      currentProjectId,
      start_date,
      end_date,
      discription,
      status: 'pending'
    }]);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  res.status(200).json({ success: true, message: 'Leave request submitted', data });
});

// 🔵 View Requests (Employee/Manager)
router.get('/:EmpId/:role', async (req, res) => {
  const { EmpId, role } = req.params;

  let query = supabase.from('leave_requests').select('*');

  if (role !== 'manager') {
    query = query.eq('EmpId', EmpId); // employee → only their requests
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  res.status(200).json({ success: true, data });
});

// 🔴 Manager updates request status
router.put('/:request_id', async (req, res) => {
  const { request_id } = req.params;
  const { status } = req.body;

  const { data: updatedData, error: updateError } = await supabase
    .from('leave_requests')
    .update({ status })
    .eq('id', request_id)
    .select();

  if (updateError) {
    return res.status(500).json({ success: false, error: updateError.message });
  }

  if (status === 'accepted' && updatedData.length > 0) {
    const leave = updatedData[0];

    // 🧠 Get employee work type
    const { data: employeeData, error: empError } = await supabase
      .from('employees')
      .select('empid, name, work_type')
      .eq('empid', leave.empid)
      .single();

    if (empError || !employeeData) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    const workType = employeeData.work_type;
    let assignedWork = [];

    if (workType === 'shift') {
      const { data } = await supabase
        .from('shifts')
        .select('*')
        .eq('assigned_to', leave.empid)
        .gte('shift_date', leave.start_date)
        .lte('shift_date', leave.end_date);
      assignedWork = data;
    } else {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', leave.empid)
        .gte('due_date', leave.start_date)
        .lte('due_date', leave.end_date);
      assignedWork = data;
    }
    // console.log('📦 Assigned Work:', assignedWork);

    const { data: otherEmployees } = await supabase
      .from('employees')
      .select('empid, name, work_type,workload')
      .neq('empid', leave.empid)
      .eq('work_type', workType);

    // 🧠 Generate general AI prompt
    const prompt = `
    An employee (ID: ${leave.empid}) of type "${workType}" is on leave from ${leave.start_date} to ${leave.end_date}.
    
    Their assigned work during leave:
    ${JSON.stringify(assignedWork, null, 2)}
    
Other available employees (with workload from 0-100, where 100 means fully occupied):
${JSON.stringify(otherEmployees, null, 2)}

Redistribute the work fairly so that employees with lower workload get more of the work.

    
    Please redistribute the work to available employees.
    Respond with valid JSON like:
    {
      "reassignments": [
        {
          "work_type": "shift",
          "shift_date": "2025-04-10",
          "new_assignee": "E102"
        },
        {
          "work_type": "non-shift",
          "task_id": 105,
          "new_assignee": "E103"
        }
      ]


      
    }
    `;
    try {
      // 🧠 Send prompt to Hugging Face Inference API
      const hfResponse = await hf.chatCompletion({
        provider: "novita",
        model: "deepseek-ai/DeepSeek-V3-0324",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 800,
      });
      // console.dir(hfResponse);
      const responseText = hfResponse.choices?.[0]?.message?.content;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in AI response");
      }
      // const parsed = JSON.parse(responseText || '{}');

      const parsed = JSON.parse(jsonMatch[0]);
      // console.log(parsed);
      for (const r of parsed.reassignments || []) {
        if (r.work_type === 'shift') {
          await supabase
            .from('shifts')
            .update({ assigned_to: r.new_assignee })
            .eq('shift_date', r.shift_date)
            .eq('assigned_to', leave.empid);
        } else {
          await supabase
            .from('tasks')
            .update({ assigned_to: r.new_assignee })
            .eq('id', r.task_id);
        }
        
        await supabase
        .from('employees')
        .update({ workload:  ('LEAST(workload + 10, 100)') })
        .eq('empid', r.new_assignee);
      }

      return res.status(200).json({
        success: true,
        message: 'Task/shift reallocation complete',
        ai_output: parsed,
        data: leave
      });

    } catch (e) {
      console.error('AI Error:', e.message);
      return res.status(500).json({
        success: false,
        message: 'AI redistribution failed',
        error: e.message
      });
    }
  }

  return res.status(200).json({
    success: true,
    message: `Leave status updated to ${status}`,
    data: updatedData[0],
  });
});


module.exports = router;
