// index.js
const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());

const loginRoute = require('./routes/login');
const leaveRoute = require('./routes/leaveRequest');
const taskAllocationsRoute = require('./routes/taskAllocations');

app.use('/login', loginRoute);
app.use('/leave', leaveRoute);
app.use('/allocation',taskAllocationsRoute)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
