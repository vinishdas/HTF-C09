import React, { useState } from 'react';
import axios from 'axios';

const CreatePlane = () => {
  const [formData, setFormData] = useState({
    work_type: 'non-shift',
    start_date: '',
    end_date: '',
    employees_required: 1,
    min_skill_level: 0,
    max_skill_level: 5,
    description: '',
    shift_group_size: 1,
    project_title: '',
    project_id: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? (checked ? 'shift' : 'non-shift') : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { ...formData };

    // Remove shift_group_size if non-shift
    if (payload.work_type === 'non-shift') {
      delete payload.shift_group_size;
    }

    try {
      const res = await axios.post(
        'http://localhost:3000/allocate',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Plan created:', res.data);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to create plan:', error);
      alert('Failed to create plan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <h2 className="text-3xl font-bold text-white mb-1 animate-fadeIn">Create New Work Plan</h2>
            <p className="text-blue-100 animate-fadeIn opacity-0" style={{ animationDelay: '0.2s' }}>
              Fill out the form below to create a new work allocation plan
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="animate-slideUp opacity-0" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center mb-4">
                <div className="relative inline-block w-12 h-6 mr-2">
                  <input
                    type="checkbox"
                    id="work-type-toggle"
                    name="work_type"
                    className="opacity-0 w-0 h-0"
                    checked={formData.work_type === 'shift'}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="work-type-toggle"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                      formData.work_type === 'shift' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span 
                      className={`absolute h-5 w-5 rounded-full bg-white transition-all duration-300 ${
                        formData.work_type === 'shift' ? 'left-6' : 'left-1'
                      }`} 
                      style={{ top: '2px' }}
                    />
                  </label>
                </div>
                <span className="font-medium text-gray-700">
                  {formData.work_type === 'shift' ? 'Shift-based Plan' : 'Non-shift Plan'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-slideUp opacity-0" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  name="project_title"
                  value={formData.project_title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter project title"
                />
              </div>

              <div className="animate-slideUp opacity-0" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
                <input
                  type="text"
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter project ID"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-slideUp opacity-0" style={{ animationDelay: '0.4s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <div className="animate-slideUp opacity-0" style={{ animationDelay: '0.5s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="animate-slideUp opacity-0" style={{ animationDelay: '0.6s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employees Required</label>
                <input
                  type="number"
                  name="employees_required"
                  value={formData.employees_required}
                  onChange={handleChange}
                  min="1"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <div className="animate-slideUp opacity-0" style={{ animationDelay: '0.7s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Skill Level (0-5)</label>
                <input
                  type="number"
                  name="min_skill_level"
                  value={formData.min_skill_level}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <div className="animate-slideUp opacity-0" style={{ animationDelay: '0.8s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Skill Level (0-5)</label>
                <input
                  type="number"
                  name="max_skill_level"
                  value={formData.max_skill_level}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>

            {formData.work_type === 'shift' && (
              <div className="animate-fadeIn opacity-0" style={{ animationDelay: '0.9s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift Group Size</label>
                <input
                  type="number"
                  name="shift_group_size"
                  value={formData.shift_group_size}
                  onChange={handleChange}
                  min="1"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            )}

            <div className="animate-slideUp opacity-0" style={{ animationDelay: '1s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Enter project description..."
              />
            </div>

            <div className="pt-4 animate-slideUp opacity-0" style={{ animationDelay: '1.1s' }}>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
                  isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 active:scale-95`}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2 h-5 w-5 border-t-2 border-white rounded-full"></span>
                    Processing...
                  </>
                ) : (
                  'Submit Plan'
                )}
              </button>
            </div>
            
            {submitSuccess && (
              <div className="animate-fadeIn bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mt-4">
                <p className="font-medium">Success!</p>
                <p>Your plan has been successfully created.</p>
              </div>
            )}
          </form>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CreatePlane;