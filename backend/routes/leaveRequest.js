const express = require('express');
const router = express.Router();
const supabase = require('../db');
const { v4: uuidv4 } = require('uuid');

// 🟢 Submit Leave Request (Employee)
router.post('/', async (req, res) => {
  const { user_id, reason, from_date, to_date } = req.body;

  const { data, error } = await supabase
    .from('Request')
    .insert([{
      leaveId: uuidv4(),
      EmpId,
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
  .eq('id',leaveId)
  .select(); // to return the updated row

if (updateError) {
  return res.status(500).json({ success: false, error: updateError.message });
}



if (status === 'accepted' && updatedData.length > 0) {
    const leave = updatedData[0];

    try {
      const aiResponse = await axios.post('http://localhost:8000/redistribute-tasks', {
        EmpId: leave.EmpId,
        from_date: leave.start_date,
        to_date: leave.end_date,
      });

      return res.status(200).json({
        success: true,
        message: 'Request accepted. Task redistribution triggered.',
        ai_response: aiResponse.data,
        data: leave
      });
    } catch (aiError) {
      console.error('Task Redistribution Error:', aiError.message);

      return res.status(200).json({
        success: true,
        message: 'Request accepted. Failed to notify AI model.',
        ai_error: aiError.message,
        data: leave
      });
    }
  }
  res.status(200).json({
    success: true,
    message: `Request ${status}`,
    data: updatedData[0]
  });
});

module.exports = router;
