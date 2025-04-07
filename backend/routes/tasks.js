const express = require('express');
const router = express.Router();
const supabase = require('../db');

// 🔹 GET /tasks?assigned_to=emp123&project_id=projX
router.get('/', async (req, res) => {
  const { assigned_to, project_id } = req.query;

  let query = supabase.from('tasks').select('*');

  if (assigned_to) query = query.eq('assigned_to', assigned_to);
  if (project_id) query = query.eq('project_id', project_id);

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  res.status(200).json({ success: true, tasks: data });
});

// 🔹 PUT /tasks/:id/update
router.put('/:id/update', async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body; // expects fields like: { status, deadline, description, ... }
  
    if (!updateFields || Object.keys(updateFields).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided for update.' });
    }
  
    const { data, error } = await supabase
      .from('tasks')
      .update(updateFields)
      .eq('id', id);
  
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  
    res.status(200).json({ success: true, message: 'Task updated successfully.', updatedTask: data });
  });
  

module.exports = router;
