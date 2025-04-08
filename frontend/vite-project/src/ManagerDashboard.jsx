// Example: ManagerDashboard.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProjectCards from "./ProjectCards";
import { useNavigate } from 'react-router-dom';
import ShiftPlanCards from "./ShiftPlanCards";
import { PlusCircle, Calendar, LayoutGrid } from 'lucide-react';

const ManagerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, name, role } = location.state || {};
  //
  const [projects, setProjects] = useState([]);
  const [shiftPlans, setShiftPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleCreatePlan = () => {
    navigate('/create-plan');
  };
    
  useEffect(() => {
    setIsLoading(true);
    // Fetch Projects
    axios
      .get("http://localhost:3000/projects")
      .then((res) => setProjects(res.data.projects))
      .catch((err) => console.error("Failed to fetch projects:", err));

    // Fetch Shift Plans
    const fetchShifts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/shifts/");
        const shiftIds = res.data.shift_ids;

        const shiftDataPromises = shiftIds.map((id) =>
          axios.get(`http://localhost:3000/shifts/${id}`)
        );

        const allShiftData = await Promise.all(shiftDataPromises);
        const shiftDetails = allShiftData.map((res) => res.data);

        setShiftPlans(shiftDetails);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch shift plans:", error);
        setIsLoading(false);
      }
    };

    fetchShifts();
  }, []);
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar name={name} />
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-indigo-800">AI Work Planner</h1>
              <h2 className="text-xl text-gray-600">Welcome, {name || "Manager"}</h2>
            </div>
            <button 
              onClick={handleCreatePlan} 
              className="group flex items-center justify-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <PlusCircle size={18} className="mr-2 group-hover:animate-pulse" />
              Create New Plan
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center mb-6">
                <LayoutGrid size={24} className="text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Projects Overview</h2>
              </div>
              <ProjectCards projects={projects} />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <Calendar size={24} className="text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Shift Based Work Plan</h2>
              </div>
              <ShiftPlanCards shifts={shiftPlans} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;