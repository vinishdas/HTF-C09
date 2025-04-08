// routes/login.js
const express = require('express');
const router = express.Router();
const supabase = require('../db');

router.post('/', async (req, res) => {
   
  try {
    const { Username, password } = req.body;

    const { data: users, error } = await supabase
      .from('EmployeeLogin')
      .select('*')
      .eq('Username', Username);

    if (error) {
      console.error('Supabase fetch error:', error.message);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = users[0];

    const isMatch = password == user.password;
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.empid,
        name: user.Username,
        role: user.role,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
