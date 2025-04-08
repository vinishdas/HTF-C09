// src/components/Navbar.jsx
import React from 'react';

const Navbar = ({ name }) => {
  return (
    <div className="flex border-2 rounded shadow-lg w-full h-16 text-black">
      {/* Company name + logo */}
      <div className="flex items-center h-full text-2xl ml-2">
        <img
          className="mr-2"
          src="https://th.bing.com/th/id/OIP.IRxxFai8PM_rkeev7tx-sQHaHa?rs=1&pid=ImgDetMain"
          alt="logo"
          width="50px"
        />
        <h1>Cloud</h1>
      </div>

      {/* Navigation links */}
      <div className="flex">
        <ul style={{ color: '#7789b4' }} className="flex items-center ml-12 text-lg">
          <li className="mr-4 cursor-pointer">Your Work</li>
          <li className="mr-4 cursor-pointer">Projects</li>
        </ul>
      </div>

      {/* Search and user info */}
      <div className="flex items-center justify-end ml-auto">
        <input
          type="text"
          placeholder="Search"
          className="mr-2 rounded-md border-2 w-72 bg-gray-100 border-dashed p-2"
        />
        <div className="flex items-center mr-2">
          <h1 style={{ color: '#7789b4' }} className="font-bold text-2xl mr-2">
            {name}
          </h1>
          <img
            width="50px"
            src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?uid=R124920817&ga=GA1.1.1314910849.1725714366&semt=ais_hybrid&w=740"
            alt="user"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
