import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ShiftDetails = () => {
  const { state } = useLocation();
  const shift = state?.shift;
  const [shiftData, setShiftData] = useState(null);

  useEffect(() => {
    if (shift?.shift_id) {
      axios
        .get(`http://localhost:3000/shifts/${shift.shift_id}`)
        .then((res) => setShiftData(res.data))
        .catch((err) => console.error('Failed to fetch shift data:', err));
    }
  }, [shift?.shift_id]);

  if (!shiftData) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="p-6 text-gray-600 font-medium text-xl bg-white shadow-lg rounded-lg animate-fadeIn">
          No shift data found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 overflow-x-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8 shadow-lg animate-slideDown">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold">Shift Plan: {shiftData.shift_id}</h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <p className="text-sm text-purple-600 font-semibold mb-2">Start Date</p>
            <p className="text-2xl font-medium">{shiftData.start_date}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <p className="text-sm text-purple-600 font-semibold mb-2">End Date</p>
            <p className="text-2xl font-medium">{shiftData.end_date}</p>
          </div>
        </div>

        <div className="mb-10 bg-white p-6 rounded-xl shadow-md animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Shift Assignments</h3>

          {shiftData.shifts?.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="grid grid-cols-3 bg-gray-100 font-medium text-gray-700">
                <div className="p-4 border-r">Shift Date</div>
                <div className="p-4 border-r">Assigned To</div>
                <div className="p-4">Group</div>
              </div>

              {shiftData.shifts.map((entry, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 border-t animate-slideUp"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <div className="p-4 border-r">{entry.shift_date}</div>
                  <div className="p-4 border-r">{entry.assigned_to}</div>
                  <div className="p-4">{entry.shift_group}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 text-yellow-700 p-6 rounded-lg flex items-center justify-center animate-pulse">
              No shift assignments found.
            </div>
          )}
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
          animation: slideUp 0.4s ease-out forwards;
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

export default ShiftDetails;
