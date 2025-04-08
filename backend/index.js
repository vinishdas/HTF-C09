// index.js
const express = require('express');
require('dotenv').config();
const app = express();

const cors = require('cors'); 
app.use(express.json());

app.use(cors());
const loginRoute = require('./routes/login');
const leaveRoute = require('./routes/leaveRequest');
const taskAllocationsRoute = require('./routes/taskAllocations');
const allocate_work = require('./routes/allocate-work');

app.use('/login', loginRoute);
app.use('/leave', leaveRoute);
// app.use('/allocation',taskAllocationsRoute)
app.use('/allocate',allocate_work);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
