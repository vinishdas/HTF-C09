const express = require('express');
const router = express.Router();
const supabase = require('../db');
const { InferenceClient } = require("@huggingface/inference");

const hf = new InferenceClient("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");

// 📦 Manager allocates work
router.post('/', async (req, res) => {
    const {
      work_type, // "shift" or "non-shift"
      start_date,
      end_date,
      employees_required,
      min_skill_level,
      max_skill_level,
      description,
      shift_group_size, // only for shift-based
      project_title,    // only for non-shift
      project_id        // added for tracking non-shift project
    } = req.body;
  
    try {
      const { data: allEmployees, error: empErr } = await supabase
        .from('employees')
        .select('empid, name,work_type,workload,skils,skill_level ')
        .eq('work_type', work_type);
  
      if (empErr || !allEmployees) {
        return res.status(500).json({ success: false, error: 'Failed to fetch employees' });
      }
  
      const filtered = allEmployees.filter(emp =>
        emp.skill_level >= min_skill_level &&
        emp.skill_level <= max_skill_level
      );
  
      // 🔁 SHIFT-BASED WORK
      if (work_type === 'shift') {
        const days = getDatesInRange(start_date, end_date);
  
        const aiPrompt = `
  You are an AI assistant helping a manager assign employees to shift-based work.
  Work Dates: ${start_date} to ${end_date}
  Employees per Shift Group: ${shift_group_size}
  Special Instructions: ${description}
  
  Available Employees:
  ${JSON.stringify(filtered, null, 2)}
  
  Assign employees to groups in a rotating schedule where each group has a max of ${shift_group_size}.
  Distribute shifts fairly and consider any relevant preferences from the manager description.
  Return format:
  [
    { "shift_date": "YYYY-MM-DD", "assigned_to": "E101", "shift_group": "Group-1" },
    ...
  ]
  `;
  
        const hfResponse = await hf.chatCompletion({
          provider: "novita",
          model: "deepseek-ai/DeepSeek-V3-0324",
          messages: [{ role: "user", content: aiPrompt }],
          max_tokens: 1000
        });
  
        const responseText = hfResponse.choices?.[0]?.message?.content;
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("No valid JSON array found in AI response");
  
        const shiftAllocations = JSON.parse(jsonMatch[0]);
  
        const { error: insertErr } = await supabase
          .from('shifts')
          .insert(shiftAllocations);
  
        if (insertErr) {
          return res.status(500).json({ success: false, error: insertErr.message });
        }
  
        return res.status(200).json({
          success: true,
          message: 'Shift-based schedule created using AI',
          data: shiftAllocations
        });
      }
  
      // 🧠 NON-SHIFT-BASED WORK
      const prompt = `
  You are an AI assistant helping a manager assign employees to a non-shift project.
  
  Project Title: ${project_title}
  Project ID: ${project_id}
  Duration: ${start_date} to ${end_date}
  Number of Employees Required: ${employees_required}
  
  Project Description:
  ${description}
  
  Available Employees (JSON):
  ${JSON.stringify(filtered, null, 2)}
  
  Each employee has:
  - empid
  - name
  - skill_level (1 to 10)
  - skills (array)
  - workload (0 to 100)
  
  Please select the best-fit employees for this project based on:
  - Matching skills mentioned in the description
  - Skill level suitable for the project
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
        max_tokens: 1000
      });
  
      const responseText = hfResponse.choices?.[0]?.message?.content;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No valid JSON found in AI response");
  
      const parsed = JSON.parse(jsonMatch[0]);
      const selected = parsed.selected_employees;
  
      const taskInsertData = selected.map(e => ({
        assigned_to: e.empid,
        project_id,
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
  
      // 🧮 Update workload for each selected employee
      for (let e of selected) {
        await supabase
          .from('employees')
          .update({ workload: supabase.rpc('increment_workload', { empid: e.empid, value: 10 }) })
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
  
  // 📅 Utility: Generate all dates in range
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