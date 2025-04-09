const express = require('express');
const router = express.Router();
const supabase = require('../db'); // your Supabase client

// GET /AssignedList/:project_id
router.get('/:project_id', async (req, res) => {
  const { project_id } = req.params;

  try {
    // Step 1: Get assigned employee IDs for the project
    const { data: taskData, error: taskError } = await supabase
      .from('non-shift')
      .select('assigned_to')
      .eq('project_id', project_id);

    if (taskError || !taskData || taskData.length === 0) {
      return res.status(404).json({ success: false, error: 'No employees assigned to this project' });
    }

    const assignedIds = [...new Set(taskData.map(t => t.assigned_to))]; // unique IDs

    // Step 2: Get employee details from 'employees' table
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('empid, name, skils')
      .in('empid', assignedIds);

    if (employeeError) {
      return res.status(500).json({ success: false, error: employeeError.message });
    }

    // Step 3: Format the response
    const team = employeeData.map(emp => ({
      empid: emp.empid,
      name: emp.name,
      skills: emp.skils || [],
    }));

    return res.status(200).json({ success: true, team });

  } catch (err) {
    console.error('Error fetching assigned list:', err.message);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
