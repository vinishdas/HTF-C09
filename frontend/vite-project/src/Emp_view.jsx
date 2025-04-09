import React from 'react'
import mark from './assets/mark.png'
import { useLocation } from 'react-router-dom';
import g_round from './assets/round.png'
import checked from './assets/checked.png'
import Navbar from './Navbar';
import { Briefcase, CheckCircle, CheckSquare, Clock, AlertCircle, LayoutDashboard } from 'lucide-react';

const Emp_view = () => {
    const location = useLocation();
    const { id, name, role } = location.state || {};
    console.log(name);
    
    return(
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <Navbar name={name} empid={id} role ={role}></Navbar>
            
            <div id="main" className='flex flex-col md:flex-row'>
                {/* Sidebar */}
                <div id="sidebar" className='w-full md:w-1/5 bg-white rounded-lg shadow-lg m-4 border border-indigo-100'>
                    <h1 className="font-bold text-2xl mt-6 mb-6 text-center text-indigo-800 flex items-center justify-center">
                        <LayoutDashboard size={24} className="mr-2 text-indigo-600" />
                        Dashboard
                    </h1>
                    
                    <div id="P_name" className='py-6 flex items-center justify-center'>
                        <div className='w-52 h-16 rounded-lg shadow-md flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
                            <div className='ml-4'>
                                <Briefcase size={24} className="text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-indigo-800 text-md font-semibold">Project Alpha</p>
                                <p className="text-gray-500 text-sm">Software Oriented</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='px-6 pb-6'>
                        <div className='w-full flex items-center p-3 rounded-md hover:bg-indigo-100 transition-colors duration-200 cursor-pointer'>
                            <img src={mark} width="35px" alt="" />
                            <h1 className='ml-3 text-indigo-700 font-medium'>Roadmap</h1>
                        </div>
                    </div>
                </div>
                
                {/* Main Content */}
                <div id="Content" className='flex flex-col md:flex-row flex-1 m-4'>
                    {/* Left Column */}
                    <div className='w-full md:w-2/5 mr-0 md:mr-4 mb-4 md:mb-0'>
                        <div className='text-gray-500 mb-2 text-xl'>Project/name</div>
                        <div className='mb-6'>
                            <p className='text-4xl font-bold text-indigo-700'>Task Allocated</p>
                        </div>
                        
                        <div id="important_Tasks" className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                            <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
                                <AlertCircle size={20} className="mr-2 text-indigo-600" />
                                Task Status
                            </h3>
                            
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                                <p className="text-indigo-800 font-semibold mb-2">Important Count</p>
                                
                                <div className='flex flex-col sm:flex-row gap-4'>
                                    <div className='flex items-center bg-white p-3 rounded-lg shadow-md'>
                                        <CheckCircle size={20} className="text-green-600 mr-2" />
                                        <p className='font-bold text-gray-700'>
                                            <span className='text-green-600 mr-1'>1</span>
                                            Completed
                                        </p>
                                    </div>
                                    
                                    <div className='flex items-center bg-white p-3 rounded-lg shadow-md'>
                                        <Clock size={20} className="text-red-600 mr-2" />
                                        <p className='font-bold text-gray-700'>
                                            <span className='text-red-600 mr-1'>1</span>
                                            Undone
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column - Sprint Box */}
                    <div className='w-full md:w-3/5 bg-white rounded-lg shadow-lg p-6'>
                        <div id="heading">
                            <h2 className='text-3xl font-bold text-indigo-700 mb-6 flex items-center'>
                                <CheckSquare size={24} className="mr-2 text-indigo-600" />
                                Sprints
                            </h2>
                        </div>
                        
                        <div id='sprint-lister'>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center mb-4 p-3 rounded-lg hover:bg-indigo-50 transition-all duration-200'>
                                <div className="flex items-center">
                                    <img src={checked} alt="" width="30px" className='mr-3' />
                                    <span className='text-gray-600 font-medium mr-3'>code-141</span>
                                    <span className='font-medium text-indigo-900'>Task 1 to be allocated</span>
                                </div>
                                
                                <button className='mt-3 sm:mt-0 sm:ml-auto px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300'>
                                    Completed
                                </button>
                            </div>
                            <hr className="border-indigo-100" />
                            
                            {/* You can add more sprint items here following the same pattern */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Emp_view;