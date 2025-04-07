const express = require('express');
const router = express.Router();
const supabase = require('../db'); // your Supabase client

// 🔹 GET /projects?EmpId=123&role=employee
router.get('/', async (req, res) => {
  const { EmpId, role } = req.query;

  let query = supabase.from('projects').select('*');

  if (role !== 'manager') {
    // Employee – only return projects they’re assigned to
    query = query.contains('assigned_to', [EmpId]); // assuming assigned_to is a string[] (array of EmpIds)
  }

  const { data, error } = await query.order('deadline', { ascending: true });

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  res.status(200).json({ success: true, projects: data });
});
 

// 🔹 PUT /projects/:id/update
router.put('/:id/update', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  res.status(200).json({ success: true, message: 'Project updated successfully', project: data[0] });
});

module.exports = router;



module.exports = router;
