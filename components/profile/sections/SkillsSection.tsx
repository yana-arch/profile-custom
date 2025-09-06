import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';

const SkillsSection: React.FC<{ data: ProfileData; animated: boolean; }> = ({ data, animated }) => (
  <AnimatedProfileSection title="Skills" id="skills" animated={animated}>
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h3 className="text-2xl font-semibold text-text-primary mb-6">Frontend</h3>
        <div className="space-y-4">
          {data.skills.frontend.map(skill => (
            <div key={skill.id}>
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-text-primary">{skill.name}</span>
                <span className="text-sm font-medium text-text-secondary">{skill.level}%</span>
              </div>
              <div className="w-full bg-border-color rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
       <div>
        <h3 className="text-2xl font-semibold text-text-primary mb-6">Backend & Tools</h3>
        <div className="space-y-4">
          {[...data.skills.backend, ...data.skills.tools].map(skill => (
            <div key={skill.id}>
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-text-primary">{skill.name}</span>
                <span className="text-sm font-medium text-text-secondary">{skill.level}%</span>
              </div>
              <div className="w-full bg-border-color rounded-full h-2.5">
                <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </AnimatedProfileSection>
);

export default SkillsSection;