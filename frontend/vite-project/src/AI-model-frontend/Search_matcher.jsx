import { useState } from "react";



export default function EmployeeMatcher() {
  const [skillsInput, setSkillsInput] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notified, setNotified] = useState([]);


  const getMatches = async () => {
    setError("");
    setResults(null);
    setLoading(true);

    const skills = skillsInput.split(",").map((s) => s.trim());

    try {
      const response = await fetch("http://127.0.0.1:5000/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Skills_Required: skills }),
      });

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("⚠️ Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const assignJob = async (person, task) => {
    await fetch('http://localhost:3000/assign-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person, task })
    });
  
    // Update state to mark this person as notified
    setNotified((prev) => [...prev, person]);
  };
  

  
  return (
    <div className="max-w-3xl mx-auto p-8 text-gray-800 font-sans">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">🔍 Employee Matcher for Projects</h1>

      <label htmlFor="skills" className="block text-lg font-medium mb-1">
        Enter Required Skills (comma separated):
      </label>
      <input
        type="text"
        id="skills"
        className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="e.g. Python, SQL, React"
        value={skillsInput}
        onChange={(e) => setSkillsInput(e.target.value)}
      />

      <button
        onClick={getMatches}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        {loading ? "Finding Matches..." : "Find Best Matches"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {results && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-green-700 mb-3">
            🧑‍🤝‍🧑 Selected Team: <span className="underline">{results.selected_team}</span>
          </h3>

          <h4 className="text-lg font-semibold mb-2">📌Task Allocation:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(() => {
  const uniquePersons = new Set();
  return Object.entries(results.task_allocation)
    .filter(([task, person]) => {
      if (uniquePersons.has(person)) return false;
      uniquePersons.add(person);
      return true;
    }) 
    .map(([task, person]) => (
      <div
        key={person}
        className="p-4 bg-cyan-50 border border-cyan-300 rounded shadow-sm"
      >
        👤 <span className="text-blue-800 text-xl">
          {person} : {task}{" "}
          <button
            style={{
              backgroundColor: notified.includes(person) ? "green" : "#363636",
            }}
            className="border-2 rounded-md p-2 text-center text-white font-bold"
            onClick={() => assignJob(person, task)}
          >
            {notified.includes(person) ? "Notified ✅" : "Notify"}
          </button>
        </span>
      </div>
    ));
    
})()}

          </div>


          <h4 className="text-lg font-semibold mt-8 mb-2">👨‍💻 Team Members:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.team_members.map((member, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-gray-200 rounded shadow-sm"
              >
                <div className="font-bold text-lg mb-1">{member.name}</div>
                <div>🎯 <strong>Score:</strong> {member.score.toFixed(4)}</div>
                <div>💼 <strong>Skills:</strong> {member.skills.join(", ")}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
