import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectCards = ({ projects }) => {
  const navigate = useNavigate();

  const handleCardClick = (project) => {
    navigate(`/ProjectDetails`, { state: { project } });
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-12 mx-auto flex flex-wrap">
        <div className="flex flex-wrap -m-4  w-1/2  ">
          {projects.map((project) => (
            <div
              key={project.project_id}
              className="p-4   lg:w-1/2 md:w-full cursor-pointer"
              onClick={() => handleCardClick(project)}
            >
              <div className="flex border-2 rounded-lg border-gray-200 p-6 flex-col hover:shadow-lg transition">
                <div className="flex-grow">
                  <h2 className="text-gray-900 text-xl font-semibold mb-2">
                    {project.project_title}
                  </h2>
                  <p className="text-base mb-1">
                    <strong>Start Date:</strong> {project.start_date}
                  </p>
                  <p className="text-base">
                    <strong>Deadline:</strong> {project.end_date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectCards;
