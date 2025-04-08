// index.js
const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors'); 
app.use(express.json());

app.use(cors());
const loginRoute = require('./routes/login');
const leaveRoute = require('./routes/leaveRequest');

app.use('/login', loginRoute);
app.use('/leave', leaveRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
