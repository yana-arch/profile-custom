import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';

const EducationSection: React.FC<{ data: ProfileData; }> = ({ data }) => (
    <AnimatedProfileSection 
        title="Education" 
        id="education" 
        scrollAnimation={data.settings.animations.scrollAnimation}
        viewMode={data.settings.viewMode}
    >
      <div className="relative border-l-2 border-border-color pl-6 sm:pl-8 space-y-12">
        {data.education.map((edu) => (
          <div key={edu.id} className="relative">
            <div className="absolute -left-[34px] sm:-left-[42px] top-1 h-4 w-4 rounded-full bg-secondary border-4 border-card-background"></div>
            <p className="text-sm font-semibold text-secondary">{edu.startDate} - {edu.endDate}</p>
            <h3 className="text-xl font-bold text-text-primary mt-1">{edu.degree}</h3>
            <p className="text-md text-text-secondary">{edu.school} - {edu.fieldOfStudy}</p>
            <div 
              className="mt-2 text-text-secondary prose" 
              dangerouslySetInnerHTML={{ __html: edu.description }}
            />
          </div>
        ))}
      </div>
    </AnimatedProfileSection>
  );

export default EducationSection;