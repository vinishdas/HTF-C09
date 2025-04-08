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
import ManagerDashboard from './ManagerDashboard';
import ProjectDetails from './ProjectDetails';
import CreatePlane from './CreatePlane';
import ShiftDetails from './ShiftDetails';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/emp-view" element={<Emp_view />} />
        <Route path="/managerDashboard" element={<ManagerDashboard/> }/>
        <Route path="/ProjectDetails" element = {<ProjectDetails/>}/>
        <Route path ="/create-plan" element = {<CreatePlane/>}/>
        <Route path ="/shiftdetails" element = {<ShiftDetails/>}/>
      </Routes>
    </Router>
    // <EmployeeMatcher/>
  );
};

export default App;
