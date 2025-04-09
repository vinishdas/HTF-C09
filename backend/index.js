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
const projects = require('./routes/projects');
const assignedListRoute = require('./routes/AssignedList');
const shiftProjects = require('./routes/shiftProjects');


app.use('/shifts',shiftProjects);
app.use('/AssignedList', assignedListRoute);

app.use('/login', loginRoute);
app.use('/leave', leaveRoute);
// app.use('/allocation',taskAllocationsRoute)
app.use('/allocate',allocate_work);
app.use('/projects',projects);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
