const express = require('express');
const router = express.Router();
const supabase = require('../db');

router.post('/',async (req, res) => {
    const { person, task } = req.body;
  
    try {
      // 1️⃣ Get employee by name
      const { data: employee, error: empError } = await supabase
        .from('employees')
        .select('empid')
        .eq('name', person)
        .single();
      if(empError)
        console.log(empError);

      if (empError || !employee) {
        return res.status(404).json({ error: 'Employee not found.' });
      }
  
      // 2️⃣ Create notification
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([
          {
            eid: employee.empid,
            message: `You have been assigned a ${task} job`,
            sent_at: new Date().toISOString(),
            status: false,
          },
        ]);
  
      if (notifError) {
        throw notifError;
      }
  
      res.status(200).json({ message: 'Job assigned and notification sent.' });
    } catch (err) {
      console.error('Error assigning job:', err);
      res.status(500).json({ error: 'Failed to assign job.' });
    }
  });


  module.exports = router;