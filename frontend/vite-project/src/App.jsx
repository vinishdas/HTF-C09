// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import Emp_view from './Emp_view'

// export default function App() {
//   return (
//    <Emp_view/>
//   )
// }

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './LoginPage';
import Emp_view from './Emp_view';
import EmployeeMatcher from './AI-model-frontend/Search_matcher';

const App = () => {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Login />} />
    //     <Route path="/emp-view" element={<Emp_view />} />
    //   </Routes>
    // </Router>
    <EmployeeMatcher/>
  );
};

export default App;
