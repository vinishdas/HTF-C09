const express = require('express');
const router = express.Router();
const supabase = require('../db');

router.get('/:eid',async (req, res) => {
       const { eid } = req.params;
     const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('eid', eid)
          .eq('status', false);
      
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
      });



router.patch('/confirm/:id', async (req, res) => {
        const { id } = req.params;
      
        const { data, error } = await supabase
          .from('notifications')
          .update({ status: true })
          .eq('id', id);
      
        if (error) return res.status(500).json({ error: error.message });
        res.json({ success: true, data });
      });
      module.exports = router;


