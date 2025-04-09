const express = require('express');
const router = express.Router();
const supabase = require('../db'); // make sure this points to your Supabase instance

// 📦 GET all unique projects from 'non-shift' table
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('non-shift')
      .select('project_id, project_title, start_date, end_date,description');

    if (error || !data) {
      return res.status(500).json({ success: false, error: error?.message || 'Failed to fetch data' });
    }

    // 🔄 Deduplicate by project_id and find min start_date, max end_date
    const projectMap = {};

    data.forEach(task => {
      const pid = task.project_id;

      if (!pid) return;

      if (!projectMap[pid]) {
        projectMap[pid] = {
          project_id: task.project_id,
          project_title: task.project_title,
          start_date: task.start_date,
          end_date: task.end_date,
          description:task.description
        };
      } else {
        // 🕒 Earliest start date
        if (new Date(task.start_date) < new Date(projectMap[pid].start_date)) {
          projectMap[pid].start_date = task.start_date;
        }
        // ⏳ Latest end date
        if (new Date(task.end_date) > new Date(projectMap[pid].end_date)) {
          projectMap[pid].end_date = task.end_date;
        }
      }
    });

    const uniqueProjects = Object.values(projectMap);

    return res.status(200).json({
      success: true,
      projects: uniqueProjects
    });

  } catch (e) {
    console.error('Project fetch error:', e.message);
    return res.status(500).json({
      success: false,
      error: e.message,
      message: 'Unable to fetch project list'
    });
  }
});

module.exports = router;
