// import { useState } from "react";



// export default function EmployeeMatcher() {
//   const [skillsInput, setSkillsInput] = useState("");
//   const [results, setResults] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [notified, setNotified] = useState([]);


//   const getMatches = async () => {
//     setError("");
//     setResults(null);
//     setLoading(true);

//     const skills = skillsInput.split(",").map((s) => s.trim());

//     try {
//       const response = await fetch("http://127.0.0.1:5000/score", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ Skills_Required: skills }),
//       });

//       const data = await response.json();
//       setResults(data);
//     } catch (err) {
//       console.error(err);
//       setError("⚠️ Unable to connect to the server. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const assignJob = async (person, task) => {
//     await fetch('http://localhost:3000/assign-job', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ person, task })
//     });
  
//     // Update state to mark this person as notified
//     setNotified((prev) => [...prev, person]);
//   };
  

  
//   return (
//     <div className="max-w-3xl mx-auto p-8 text-gray-800 font-sans">
//       <h1 className="text-3xl font-bold text-blue-800 mb-6">🔍 Employee Matcher for Projects</h1>

//       <label htmlFor="skills" className="block text-lg font-medium mb-1">
//         Enter Required Skills (comma separated):
//       </label>
//       <input
//         type="text"
//         id="skills"
//         className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         placeholder="e.g. Python, SQL, React"
//         value={skillsInput}
//         onChange={(e) => setSkillsInput(e.target.value)}
//       />

//       <button
//         onClick={getMatches}
//         className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-200"
//       >
//         {loading ? "Finding Matches..." : "Find Best Matches"}
//       </button>

//       {error && (
//         <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {results && (
//         <div className="mt-8">
//           <h3 className="text-xl font-semibold text-green-700 mb-3">
//             🧑‍🤝‍🧑 Selected Team: <span className="underline">{results.selected_team}</span>
//           </h3>

//           <h4 className="text-lg font-semibold mb-2">📌Task Allocation:</h4>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {(() => {
//   const uniquePersons = new Set();
//   return Object.entries(results.task_allocation)
//     .filter(([task, person]) => {
//       if (uniquePersons.has(person)) return false;
//       uniquePersons.add(person);
//       return true;
//     }) 
//     .map(([task, person]) => (
//       <div
//         key={person}
//         className="p-4 bg-cyan-50 border border-cyan-300 rounded shadow-sm"
//       >
//         👤 <span className="text-blue-800 text-xl">
//           {person} : {task}{" "}
//           <button
//             style={{
//               backgroundColor: notified.includes(person) ? "green" : "#363636",
//             }}
//             className="border-2 rounded-md p-2 text-center text-white font-bold"
//             onClick={() => assignJob(person, task)}
//           >
//             {notified.includes(person) ? "Notified ✅" : "Notify"}
//           </button>
//         </span>
//       </div>
//     ));
    
// })()}

//           </div>


//           <h4 className="text-lg font-semibold mt-8 mb-2">👨‍💻 Team Members:</h4>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {results.team_members.map((member, idx) => (
//               <div
//                 key={idx}
//                 className="p-4 bg-white border border-gray-200 rounded shadow-sm"
//               >
//                 <div className="font-bold text-lg mb-1">{member.name}</div>
//                 <div>🎯 <strong>Score:</strong> {member.score.toFixed(4)}</div>
//                 <div>💼 <strong>Skills:</strong> {member.skills.join(", ")}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
      setError("Unable to connect to the server. Please try again.");
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
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md text-gray-800 font-sans">
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Employee Matcher for Projects</h1>
        <p className="text-gray-600 mt-2">Find the optimal team based on required skills</p>
      </header>

      <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
        <label htmlFor="skills" className="block text-base font-medium mb-2 text-gray-700">
          Enter Required Skills:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="skills"
            className="flex-1 border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Python, SQL, React"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
          />
          <button
            onClick={getMatches}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center disabled:bg-blue-400"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing
              </span>
            ) : (
              "Find Best Matches"
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="my-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {results && (
        <div className="mt-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">
              Selected Team: 
              <span className="ml-2 px-3 py-1 bg-blue-50 text-blue-700 rounded font-medium">{results.selected_team}</span>
            </h3>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-800 border-b pb-2">
              Task Allocation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="p-4 bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-gray-500 text-sm mb-1">Team Member</div>
                          <div className="font-medium text-lg">{person}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-500 text-sm mb-1">Assignment</div>
                          <div className="font-medium">{task}</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          className={`w-full py-2 px-4 rounded text-white font-medium transition ${
                            notified.includes(person) 
                              ? "bg-green-600 hover:bg-green-700" 
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                          onClick={() => assignJob(person, task)}
                        >
                          {notified.includes(person) ? "Notification Sent" : "Send Assignment"}
                        </button>
                      </div>
                    </div>
                  ));
              })()}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-800 border-b pb-2">
              Team Members
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.team_members.map((member, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition"
                >
                  <div className="font-bold text-lg mb-3 text-gray-800">{member.name}</div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">Match Score</div>
                      <div className="font-semibold">{member.score.toFixed(4)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">Skills Count</div>
                      <div className="font-semibold">{member.skills.length}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm text-gray-600 mb-2">Skills:</div>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-sm text-sm border border-blue-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}