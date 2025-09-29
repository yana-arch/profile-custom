import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';
import { DocumentArrowDownIcon } from '../../icons/Icons';

const AwardsSection: React.FC<{ data: ProfileData; }> = ({ data }) => (
    <AnimatedProfileSection 
        title="Awards & Achievements" 
        id="awards" 
        scrollAnimation={data.settings.animations.scrollAnimation}
        viewMode={data.settings.viewMode}
    >
      <div className="relative border-l-2 border-border-color pl-6 sm:pl-8 space-y-12">
        {data.awards.map((award) => (
          <div key={award.id} className="relative">
            <div className="absolute -left-[34px] sm:-left-[42px] top-1 h-4 w-4 rounded-full bg-secondary border-4 border-card-background"></div>
            <p className="text-sm font-semibold text-secondary">{award.date}</p>
            <h3 className="text-xl font-bold text-text-primary mt-1">{award.name}</h3>
            <p className="text-md text-text-secondary">{award.issuer}</p>
            <div 
              className="mt-2 text-text-secondary prose" 
              dangerouslySetInnerHTML={{ __html: award.description }}
            />
            {award.attachmentUrl && (
                <a href={award.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline text-sm mt-3">
                   <DocumentArrowDownIcon className="w-4 h-4 mr-1"/>
                   View Attachment
                </a>
            )}
          </div>
        ))}
      </div>
    </AnimatedProfileSection>
  );

export default AwardsSection;