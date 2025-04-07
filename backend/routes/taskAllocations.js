const express = require('express');
const router = express.Router();
const axios = require('axios'); // for calling AI model later

// Create a new AI-based task allocation request
router.post('/create', async (req, res) => {
  const {
    project_name,
    requirements, // e.g., { frontend: true, backend: true, devops: true }
    technologies, // e.g., ['React', 'Node.js', 'AWS']
    preferred_team_size,
    start_date,
    end_date,
    notes // optional project notes
  } = req.body;

  // ✅ Step 1: Validate input
  if (!project_name || !requirements || !start_date || !end_date) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // ✅ Step 2: Fetch developer data from DB (placeholder)
  // Example: seniorDevelopers = await db.getAvailableSeniors(skills, availability);
  const seniorDevelopers = []; // Fetch from Supabase
  const juniorDevelopers = [];
  const interns = [];

  // ✅ Step 3: Structure the payload for AI task allocator
  const aiPayload = {
    project_name,
    requirements,
    technologies,
    preferred_team_size,
    start_date,
    end_date,
    developers: {
      seniors: seniorDevelopers,
      juniors: juniorDevelopers,
      interns: interns
    }
  };

  try {
    // ✅ Step 4: Send data to FastAPI AI model
    const aiResponse = await axios.post('http://localhost:8000/allocate-team', aiPayload);

    const proposed_team = aiResponse.data.team; // Team object returned by AI
    const reasoning = aiResponse.data.reasoning; // Optional: explanation of selection

    // ✅ Step 5: Save project proposal to DB (placeholder)
    // await supabase.from('task_allocations').insert({ project_name, proposed_team, ... })

    // ✅ Step 6: Return the proposal to manager for review
    res.status(200).json({
      success: true,
      message: 'Team proposed successfully by AI',
      project: {
        name: project_name,
        start_date,
        end_date,
        team: proposed_team,
        notes: reasoning
      }
    });
  } catch (error) {
    console.error('AI Allocation Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'AI model failed to generate a team',
      error: error.message
    });
  }
});

module.exports = router;
