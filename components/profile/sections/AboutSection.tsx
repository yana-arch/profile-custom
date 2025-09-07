import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';
import { LinkedInIcon, GitHubIcon, GlobeAltIcon } from '../../icons/Icons';

const generateImageSrcSet = (imageUrl: string, sizes: number[] = [150, 300, 450]): string => {
  if (!imageUrl) return '';
  if (imageUrl.includes('i.pravatar.cc/')) {
    try {
        const url = new URL(imageUrl);
        const userIdQuery = url.search;
        return sizes
            .map(s => `https://i.pravatar.cc/${s}${userIdQuery} ${s}w`)
            .join(', ');
    } catch (e) {
        return '';
    }
  }
  return '';
};


const AboutSection: React.FC<{ data: ProfileData; }> = ({ data }) => (
  <AnimatedProfileSection 
    title="About Me" 
    id="about" 
    scrollAnimation={data.settings.animations.scrollAnimation}
    viewMode={data.settings.viewMode}
  >
    <div className="flex flex-col md:flex-row items-center gap-12">
      <img 
        src={data.personalInfo.avatar} 
        srcSet={generateImageSrcSet(data.personalInfo.avatar)}
        sizes="12rem"
        alt={data.personalInfo.name} 
        className="w-48 h-48 rounded-full shadow-lg object-cover"
        loading="lazy"
      />
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