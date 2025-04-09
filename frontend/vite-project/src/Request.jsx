import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Request = () => {
  const location = useLocation();
  const { empid, role } = location.state || {};
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  
  useEffect(() => {
    fetchRequests();
  }, [empid, role]);
  
  const fetchRequests = async () => {
    if (!empid || !role) return;
    
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/leave/${empid}/${role}`);
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [requestId]: true }));
      
      const response = await axios.put(`http://localhost:3000/leave/${requestId}`, {
        status: newStatus
      });
      
      if (response.data && response.data.success) {
        // Update local state to reflect the change
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req.id === requestId ? { ...req, status: newStatus } : req
          )
        );
      }
    } catch (error) {
      console.error(`Failed to update request status:`, error);
      alert(`Failed to update request. Please try again.`);
    } finally {
      setUpdating(prev => ({ ...prev, [requestId]: false }));
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6 border-b-2 border-indigo-200 pb-2 transform transition-all animate-fade-in-down">
          {role?.toLowerCase() === 'manager' ? 'All Leave Requests' : 'Your Leave Requests'}
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-indigo-300 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-indigo-300 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-indigo-300 rounded"></div>
                  <div className="h-4 bg-indigo-300 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-indigo-100 transition-all duration-300 hover:shadow-xl">
            <svg className="w-16 h-16 mx-auto text-indigo-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="text-gray-600 text-lg">No leave requests to display.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {requests.map((req, index) => (
              <div 
                key={req.id} 
                className="bg-white rounded-lg shadow-md border border-indigo-100 overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-indigo-600 p-3 text-white font-medium flex justify-between items-center">
                  <span className="truncate">Leave Request #{req.id}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(req.status)}`}>
                    {req.status.toUpperCase()}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <p className="text-gray-700"><span className="font-medium">Employee ID:</span> {req.EmpId}</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-gray-700"><span className="font-medium">From:</span> {req.start_date}</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-gray-700"><span className="font-medium">To:</span> {req.end_date}</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <p className="text-gray-700"><span className="font-medium">Reason:</span> {req.reason}</p>
                  </div>
                  
                  {/* Action Buttons - Only show for pending requests and managers */}
                  {role?.toLowerCase() === 'manager' && req.status === 'pending' && (
                    <div className="mt-4 flex space-x-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => updateRequestStatus(req.id, 'accepted')}
                        disabled={updating[req.id]}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md transition-colors duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating[req.id] ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                        Accept
                      </button>
                      <button
                        onClick={() => updateRequestStatus(req.id, 'rejected')}
                        disabled={updating[req.id]}
                        className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-md transition-colors duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating[req.id] ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        )}
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;