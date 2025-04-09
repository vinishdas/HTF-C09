import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Multiple JSON datasets (can also be fetched from external files/APIs)
const projectDataSets = [
  [
    {
      id: 1,
      title: 'E-Commerce Web App',
      summary: 'Built a scalable shopping platform.',
      details: 'Used MERN stack. Integrated Stripe. Agile 2-week sprints.',
      tech: ['MongoDB', 'Express', 'React', 'Node.js'],
      duration: '3 months',
      outcome: '98% client satisfaction.',
    },
    {
      id: 2,
      title: 'Library Management System',
      summary: 'Managed book inventory and lending system.',
      details: 'Used Django and React, deployed on AWS.',
      tech: ['Django', 'React', 'PostgreSQL'],
      duration: '1.5 months',
      outcome: 'Streamlined librarian operations by 60%.',
    },
  ],
  [
    {
      id: 3,
      title: 'HR Portal',
      summary: 'Automated employee management.',
      details: 'React frontend with Flask backend.',
      tech: ['React', 'Flask', 'MySQL'],
      duration: '2 months',
      outcome: 'Reduced manual HR tasks.',
    },
    {
      id: 4,
      title: 'Online Examination System',
      summary: 'Hosted exams with secure login and auto-grading.',
      details: 'Built with Spring Boot and Angular.',
      tech: ['Spring Boot', 'Angular', 'MongoDB'],
      duration: '3 months',
      outcome: 'Handled 5k students at peak load.',
    },
  ],
  [
    {
      id: 5,
      title: 'Task Tracker App',
      summary: 'Daily Kanban tool for remote teams.',
      details: 'Used React, Zustand, and Supabase.',
      tech: ['React', 'Zustand', 'Supabase'],
      duration: '1 month',
      outcome: 'Team productivity increased by 40%.',
    },
  ],
];

// Dummy current project
const currentProject = {
  title: 'Client Task Manager App',
  client: 'EID: 210',
  description: 'Assigned via notification. Task management tool for client-side team.',
  tasks: [
    { id: 1, task: 'Set up database schema', done: false },
    { id: 2, task: 'Integrate authentication', done: true },
    { id: 3, task: 'Develop frontend UI for tasks', done: false },
    { id: 4, task: 'Write API routes', done: false },
  ],
};

// Helper to randomly pick 2 different datasets
function getTwoRandomDataSets(dataSets) {
  let indexes = new Set();
  while (indexes.size < 2 && dataSets.length > 1) {
    indexes.add(Math.floor(Math.random() * dataSets.length));
  }
  return Array.from(indexes).map(index => dataSets[index]).flat();
}

export default function Projects() {
  const location = useLocation();
  const { id, name, role, msg } = location.state || {
    id: 'N/A',
    name: 'Guest',
    role: 'Viewer',
    msg: '',
  };

  const [expanded, setExpanded] = useState(null);
  const [taskState, setTaskState] = useState(currentProject.tasks);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    const randomProjects = getTwoRandomDataSets(projectDataSets);
    setSelectedProjects(randomProjects);
  }, []);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const toggleTask = (id) => {
    setTaskState(taskState.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  return (
    <div className='ml-20 mt-10'>
      <div className='mb-6 text-gray-700'>
        <p><strong>User ID:</strong> {id}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Role:</strong> {role}</p>
      </div>

      <h2 className='text-xl font-bold mb-4'>Random Past Projects</h2>
      <div className='space-y-4 w-[70%]'>
        {selectedProjects.map((project) => (
          <div
            key={project.id}
            className='border border-gray-300 p-4 rounded-md hover:shadow-lg transition'
          >
            <div
              onClick={() => toggleExpand(project.id)}
              className='cursor-pointer flex justify-between items-center'
            >
              <div>
                <h3 className='text-lg font-semibold'>{project.title}</h3>
                <p className='text-gray-600'>{project.summary}</p>
              </div>
              <span>{expanded === project.id ? '-' : '+'}</span>
            </div>
            {expanded === project.id && (
              <div className='mt-4 text-sm text-gray-800'>
                <p><strong>Details:</strong> {project.details}</p>
                <p><strong>Technologies:</strong> {project.tech.join(', ')}</p>
                <p><strong>Duration:</strong> {project.duration}</p>
                <p><strong>Outcome:</strong> {project.outcome}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message Display */}
      <h2 className='text-xl font-bold mt-10 mb-2'>New Projects</h2>
      <div className='border border-blue-300 p-4 rounded-md bg-blue-50 w-[70%] mb-6'>
        <p><strong>Added</strong> {msg}</p>
      </div>

      <h2 className='text-xl font-bold mt-10 mb-4'>Current Project</h2>
      <div className='border border-green-400 p-4 rounded-md bg-green-50 w-[70%]'>
        <h3 className='text-lg font-semibold'>{currentProject.title}</h3>
        <p><strong>Client:</strong> {currentProject.client}</p>
        <p className='mb-3'>{currentProject.description}</p>
        <ul className='space-y-2'>
          {taskState.map((task) => (
            <li key={task.id} className='flex items-center'>
              <input
                type='checkbox'
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className='mr-2'
              />
              <span className={task.done ? 'line-through text-gray-500' : ''}>
                {task.task}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
