import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';

const ExperienceSection: React.FC<{ data: ProfileData }> = ({ data }) => (
  <AnimatedProfileSection title="Experience" id="experience">
    <div className="relative border-l-2 border-border-color pl-8 space-y-12">
      {data.experience.map((job) => (
        <div key={job.id} className="relative">
          <div className="absolute -left-[42px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-card-background"></div>
          <p className="text-sm font-semibold text-primary">{job.startDate} - {job.endDate}</p>
          <h3 className="text-xl font-bold text-text-primary mt-1">{job.title}</h3>
          <p className="text-md text-text-secondary">{job.company}</p>
          <p className="mt-2 text-text-secondary">{job.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {job.skillsUsed.map(skill => <span key={skill} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">{skill}</span>)}
          </div>
        </div>
      ))}
    </div>
  </AnimatedProfileSection>
);

export default ExperienceSection;
