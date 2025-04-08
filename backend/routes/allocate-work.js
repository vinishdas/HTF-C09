const express = require('express');
const router = express.Router();
const supabase = require('../db');
const { InferenceClient } = require("@huggingface/inference");

const hf = new InferenceClient("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");

// 📦 Manager allocates work
router.post('/allocate-work', async (req, res) => {
    const {
      work_type, // "shift" or "non-shift"
      start_date,
      end_date,
      employees_required,
      min_experience,
      max_experience,
      description,
      shift_group_size, // only for shift-based
      project_title // only for non-shift
    } = req.body;
  
    try {
      const { data: allEmployees, error: empErr } = await supabase
        .from('employees')
        .select('empid, name, experience, skills, workload, work_type')
        .eq('work_type', work_type);
  
      if (empErr || !allEmployees) {
        return res.status(500).json({ success: false, error: 'Failed to fetch employees' });
      }
  
      const filtered = allEmployees.filter(emp =>
        emp.experience >= min_experience &&
        emp.experience <= max_experience
      );
  
      if (work_type === 'shift') {
        // 🧠 Create shift schedule in groups based on shift_group_size
        const days = getDatesInRange(start_date, end_date);
        let shiftAllocations = [];
  
        let employeeIndex = 0;
        for (let day of days) {
          let groupNumber = 1;
  
          while (employeeIndex < filtered.length) {
            const group = filtered.slice(employeeIndex, employeeIndex + shift_group_size);
            if (group.length === 0) break;
  
            for (let emp of group) {
              shiftAllocations.push({
                shift_date: day,
                assigned_to: emp.empid,
                shift_group: `Group-${groupNumber}`
              });
            }
  
            groupNumber++;
            employeeIndex += shift_group_size;
          }
  
          employeeIndex = 0; // reset for next day
        }
  
        // ✅ Insert into `shifts` table
        const { error: insertErr } = await supabase
          .from('shifts')
          .insert(shiftAllocations);
  
        if (insertErr) {
          return res.status(500).json({ success: false, error: insertErr.message });
        }
  
        return res.status(200).json({
          success: true,
          message: 'Shift-based schedule created',
          data: shiftAllocations
        });
      }
  
      // 🔮 Non-shift-based: Use AI to select best employees
      const prompt = `
  You are an AI assistant helping a manager assign employees to a new non-shift based project.
  
  Project Title: ${project_title}
  Duration: ${start_date} to ${end_date}
  Number of Employees Required: ${employees_required}
  
  Project Description:
  ${description}
  
  Available Employees (JSON):
  ${JSON.stringify(filtered, null, 2)}
  
  Each employee has:
  - empid
  - name
  - experience (in years)
  - skills (array)
  - workload (0 to 100)
  
  Please select the best-fit employees for this project based on:
  - Matching skills mentioned in the description
  - Experience level suitable for the project
  - Lower workload preferred
  
  Respond in valid JSON like:
  {
    "selected_employees": [
      { "empid": "E103", "reason": "Strong match on backend skills, low workload" },
      ...
    ]
  }
  `;
  
      const hfResponse = await hf.chatCompletion({
        provider: "novita",
        model: "deepseek-ai/DeepSeek-V3-0324",
        
        
        
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
      });
  
      const responseText = hfResponse.choices?.[0]?.message?.content;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No valid JSON found in AI response");
  
      const parsed = JSON.parse(jsonMatch[0]);
      const selected = parsed.selected_employees;
  
      // ✅ Insert tasks for selected employees
      const taskInsertData = selected.map(e => ({
        assigned_to: e.empid,
        project_title,
        start_date,
        end_date,
        description
      }));
  
      const { error: taskErr } = await supabase
        .from('tasks')
        .insert(taskInsertData);
  
      if (taskErr) {
        return res.status(500).json({ success: false, error: taskErr.message });
      }
  
      // 🧮 Optionally update workload (e.g., add +10)
      for (let e of selected) {
        await supabase
          .from('employees')
          .update({ workload: supabase.rpc('increment_workload', { emp_id: e.empid, value: 10 }) })
          .eq('empid', e.empid);
      }
  
      return res.status(200).json({
        success: true,
        message: 'Non-shift-based task allocation completed',
        ai_output: parsed,
        data: taskInsertData
      });
  
    } catch (e) {
      console.error('Allocation Error:', e.message);
      return res.status(500).json({
        success: false,
        error: e.message,
        message: 'Work allocation failed'
      });
    }
  });
  
  // 📅 Utility to get all dates between range
  function getDatesInRange(start, end) {
    const date = new Date(start);
    const endDate = new Date(end);
    const dates = [];
  
    while (date <= endDate) {
      dates.push(new Date(date).toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
  
    return dates;
  }
  
module.exports = router;