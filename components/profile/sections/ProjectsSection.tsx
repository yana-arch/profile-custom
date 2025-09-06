import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';
import { GitHubIcon, GlobeAltIcon } from '../../icons/Icons';

const ProjectsSection: React.FC<{ data: ProfileData }> = ({ data }) => (
  <AnimatedProfileSection title="Projects" id="projects">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.projects.map(project => (
        <div key={project.id} className="project-card bg-card-background rounded-lg shadow-md overflow-hidden group transition-all duration-300">
          <img src={project.image} alt={project.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="p-6">
            <h3 className="text-xl font-bold text-text-primary mb-2">{project.name}</h3>
            <p className="text-text-secondary mb-4">{project.description}</p>
            <div className="flex justify-end space-x-4">
              <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors"><GitHubIcon className="w-6 h-6"/></a>
              <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors"><GlobeAltIcon className="w-6 h-6"/></a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </AnimatedProfileSection>
);

export default ProjectsSection;
