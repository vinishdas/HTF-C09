import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Request = () => {
  const location = useLocation();
  const { empid, role } = location.state || {};

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [aiOutput, setAiOutput] = useState({});
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    start_date: '',
    end_date: ''
  });

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
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req.id === requestId ? { ...req, status: newStatus } : req
          )
        );

        if (response.data.ai_output?.reassignments) {
          setAiOutput(prev => ({
            ...prev,
            [requestId]: response.data.ai_output.reassignments
          }));
        }
      }
    } catch (error) {
      console.error(`Failed to update request status:`, error);
      alert(`Failed to update request. Please try again.`);
    } finally {
      setUpdating(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!formData.reason || !formData.start_date || !formData.end_date) {
      alert('Please fill out all fields');
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post('http://localhost:3000/leave/', {
        empid,
        reason: formData.reason,
        start_date: formData.start_date,
        end_date: formData.end_date
      });

      if (response.data && response.data.success) {
        setFormData({ reason: '', start_date: '', end_date: '' });
        setShowNewRequestForm(false);
        fetchRequests();
        alert('Leave request submitted successfully!');
      }
    } catch (error) {
      console.error('Failed to submit leave request:', error);
      alert('Failed to submit leave request. Please try again.');
    } finally {
      setSubmitting(false);
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
        <div className="flex justify-between items-center mb-6 border-b-2 border-indigo-200 pb-2">
          <h1 className="text-3xl font-bold text-indigo-900">
            {role?.toLowerCase() === 'manager' ? 'All Leave Requests' : 'Your Leave Requests'}
          </h1>

          {role?.toLowerCase() !== 'manager' && (
            <button
              onClick={() => setShowNewRequestForm(!showNewRequestForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-md transition"
            >
              {showNewRequestForm ? 'Cancel' : 'New Request'}
            </button>
          )}
        </div>

        {/* New Leave Request Form */}
        {showNewRequestForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-indigo-100">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">New Leave Request</h2>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" required />
              <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" required />
              <textarea name="reason" value={formData.reason} onChange={handleInputChange} placeholder="Reason" className="w-full border px-3 py-2 rounded" rows="3" required />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        )}

        {/* Requests List */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-500">No leave requests found.</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="bg-white shadow-md rounded p-4 mb-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">From: {request.start_date} To: {request.end_date}</p>
                  <p className="text-sm text-gray-600">Reason: {request.reason}</p>
                  <p className={`inline-block mt-1 px-2 py-1 text-xs rounded border ${getStatusColor(request.status)}`}>
                    {request.status.toUpperCase()}
                  </p>
                </div>
                {role?.toLowerCase() === 'manager' && request.status === 'pending' && (
                  <div className="space-x-2">
                    <button onClick={() => updateRequestStatus(request.id, 'accepted')} disabled={updating[request.id]} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                      Accept
                    </button>
                    <button onClick={() => updateRequestStatus(request.id, 'rejected')} disabled={updating[request.id]} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Show AI Reassignments if available */}
              {aiOutput[request.id]?.length > 0 && (
                <div className="mt-3 border-t pt-2 text-sm">
                  <p className="font-medium text-indigo-700 mb-1">AI Suggested Reassignments:</p>
                  <ul className="list-disc list-inside">
                    {aiOutput[request.id].map((item, index) => (
                      <li key={index}>
                        {item.shift_date} — Assign to <strong>{item.new_assignee}</strong> ({item.work_type})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Request;
