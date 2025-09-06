import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';
import { LinkedInIcon, GitHubIcon, GlobeAltIcon } from '../../icons/Icons';

const AboutSection: React.FC<{ data: ProfileData }> = ({ data }) => (
  <AnimatedProfileSection title="About Me" id="about">
    <div className="flex flex-col md:flex-row items-center gap-12">
      <img src={data.personalInfo.avatar} alt={data.personalInfo.name} className="w-48 h-48 rounded-full shadow-lg object-cover" />
      <div className="flex-1 text-lg text-text-secondary">
        <p>{data.personalInfo.bio}</p>
        <div className="mt-6 flex items-center space-x-6">
          <a href={data.personalInfo.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><LinkedInIcon className="w-8 h-8"/></a>
          <a href={data.personalInfo.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><GitHubIcon className="w-8 h-8"/></a>
          <a href={data.personalInfo.contact.portfolio} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><GlobeAltIcon className="w-8 h-8"/></a>
        </div>
      </div>
    </div>
  </AnimatedProfileSection>
);

export default AboutSection;
