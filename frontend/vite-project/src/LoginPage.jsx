// src/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          Username: credentials.username, 
          password: credentials.password 
        }),
      }); 
      
      const data = await response.json();
      
      if (data.success) {
        const userRole = data.user.role?.toLowerCase();

        if (userRole == 'manager') {
          navigate('/ManagerDashboard', { state: data.user });
        } else if (userRole == 'employee') {
          navigate('/emp-view', { state: data.user });
        } else {
          setError('Invalid role. Access denied.');
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      {/* Main Title */}
      <h1 className="text-5xl font-bold text-center text-indigo-800 mb-8 animate-fadeIn">
        AI Work Planner
      </h1>
      
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl transform transition-all hover:scale-105 duration-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Employee Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm animate-pulse">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500 group-hover:text-indigo-700 transition-colors duration-200">
              <User size={18} />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500 group-hover:text-indigo-700 transition-colors duration-200">
              <Lock size={18} />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={18} className="mr-2" />
                Login
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <a href="#" className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200">Forgot password?</a>
        </div>
      </div>
    </div>
  );
};

// Add these animations to your CSS or tailwind.config.js
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }
// .animate-fadeIn {
//   animation: fadeIn 1s ease-in-out;
// }

export default LoginPage;