// index.js
const express = require('express');
require('dotenv').config();
app.use(express.json());

const app = express();
const loginRoute = require('./routes/login');
const leaveRoute = require('./routes/leaveRequest');

app.use('/login', loginRoute);
app.use('/leave', leaveRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
