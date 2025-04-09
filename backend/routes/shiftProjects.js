const express = require('express');
const router = express.Router();
const supabase = require('../db');



// 🔹 GET all unique shift IDs
router.get('/', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('shift_id')
        .neq('shift_id', null); // In case null values exist
  
      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
  
      // 🧼 Remove duplicates
      const uniqueIds = [...new Set(data.map(item => item.shift_id))];
  
      res.status(200).json({ success: true, shift_ids: uniqueIds });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

// GET details for a specific shift_id
router.get('/:shift_id', async (req, res) => {
    const { shift_id } = req.params;
  
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('shift_date, assigned_to, shift_group')
        .eq('shift_id', shift_id);
  
      if (error || !data || data.length === 0) {
        return res.status(404).json({ success: false, message: 'Shift plan not found' });
      }
  
      const dates = data.map(d => new Date(d.shift_date));
      const start_date = new Date(Math.min(...dates)).toISOString().split('T')[0];
      const end_date = new Date(Math.max(...dates)).toISOString().split('T')[0];
  
      res.json({
        success: true,
        shift_id,
        start_date,
        end_date,
        shifts: data
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
module.exports = router;