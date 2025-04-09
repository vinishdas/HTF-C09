import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const progressData = [
  { name: 'HTML', progress: 90 },
  { name: 'CSS', progress: 80 },
  { name: 'JS', progress: 75 },
  { name: 'React', progress: 70 },
];

export default function UserProfile({ name }) {
  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => setShowProfile(!showProfile);

  return (
    <div className='relative ml-auto flex items-center justify-end'>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search"
        className="mr-4 rounded-md border-2 border-dashed w-72 bg-gray-100 p-2"
      />

      {/* Profile Display */}
      <div
        className="flex items-center mr-4 cursor-pointer"
        onClick={toggleProfile}
      >
        <h1 style={{ color: '#7789b4' }} className="font-bold text-2xl mr-2">
          {name}
        </h1>
        <img
          width="50px"
          src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
          alt="Profile"
          className="rounded-full border-2 border-blue-300"
        />
      </div>

      {/* Dropdown Profile Card */}
      {showProfile && (
        <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-4 w-[320px] z-50">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              alt="User"
              className="w-16 h-16 rounded-full border"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
              <p className="text-sm text-gray-600">Frontend Developer</p>
              <p className="text-xs text-gray-400">Rank: Silver</p>
            </div>
          </div>

          {/* Graph */}
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Coins & Awards */}
          <div className="mt-4 flex justify-between text-sm">
            <div>
              🪙 <strong>Coins:</strong> 320
            </div>
            <div>
              🏆 <strong>Awards:</strong> 4
            </div>
            <div>
              🎯 <strong>Tasks:</strong> 12/20
            </div>
          </div>

          {/* Bio */}
          <div className="mt-3 text-xs text-gray-600">
            "Passionate about building responsive UIs and exploring new frontend frameworks. Loves React and coffee ☕"
          </div>
        </div>
      )}
    </div>
  );
}
