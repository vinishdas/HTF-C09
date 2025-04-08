// ShiftPlanCards.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const ShiftPlanCards = ({ shifts }) => {
  const navigate = useNavigate();

  const handleCardClick = (shift) => {
    navigate(`/shiftdetails`, { state: { shift } });
  };

  if (!shifts || shifts.length === 0) {
    return <div>No shift plans available.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {shifts.map((shift) => (
        <div
          key={shift.shift_id}
          className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => handleCardClick(shift)}
        >
          <h3 className="text-xl font-semibold mb-2">Shift Plan: {shift.shift_id}</h3>
          <p><strong>Start:</strong> {shift.start_date}</p>
          <p><strong>End:</strong> {shift.end_date}</p>
          <p><strong>Total Shifts:</strong> {shift.shifts.length}</p>
        </div>
      ))}
    </div>
  );
};

export default ShiftPlanCards;
