import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ProjectDetails = () => {
  const { state } = useLocation();
  const project = state?.project;
  const [team, setTeam] = useState([]);
  
  useEffect(() => {
    if (project?.project_id) {
      axios
        .get(`http://localhost:3000/AssignedList/${project.project_id}`)
        .then((res) => setTeam(res.data.team))
        .catch((err) => console.error('Failed to fetch team:', err));
    }
  }, [project?.project_id]);
  
  if (!project) return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 text-gray-600 font-medium text-xl bg-white shadow-lg rounded-lg animate-fadeIn">
        No project data found.
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen w-screen bg-gray-50 overflow-x-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 shadow-lg animate-slideDown">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold">{project.project_title}</h2>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <p className="text-sm text-blue-600 font-semibold mb-2">Start Date</p>
            <p className="text-2xl font-medium">{project.start_date}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <p className="text-sm text-blue-600 font-semibold mb-2">Deadline</p>
            <p className="text-2xl font-medium">{project.end_date}</p>
          </div>
        </div>
        
        <div className="mb-10 bg-white p-6 rounded-xl shadow-md animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
          <p className="text-gray-600">{project.description}</p>
        </div>
        
        <div className="mb-10 bg-white p-6 rounded-xl shadow-md animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Team Members</h3>
          
          {team.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 bg-gray-100 font-medium text-gray-700">
                <div className="p-4 border-r">Member</div>
                <div className="p-4">Skills</div>
              </div>
              
              {team.map((member, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-2 border-t animate-slideUp"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="p-4 border-r font-medium">{member.name}</div>
                  <div className="p-4">{member.skills.join(', ')}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 text-yellow-700 p-6 rounded-lg flex items-center justify-center animate-pulse">
              No team members assigned yet.
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 mt-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
            Assign Tasks
          </button>
          
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-medium shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
            Allocate Tasks with AI
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;