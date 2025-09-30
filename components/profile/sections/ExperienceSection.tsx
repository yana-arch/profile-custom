import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';
import VirtualizedList from '../../common/VirtualizedList';
import { useVirtualization } from '../../../hooks/useVirtualization';

// Experience item component for reuse
const ExperienceItem: React.FC<{ job: any; index: number }> = ({ job, index }) => (
  <div key={job.id} className="relative">
    <div className="absolute -left-[34px] sm:-left-[42px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-card-background"></div>
    <p className="text-sm font-semibold text-primary">{job.startDate} - {job.endDate}</p>
    <h3 className="text-xl font-bold text-text-primary mt-1">{job.title}</h3>
    <p className="text-md text-text-secondary">{job.company}</p>
    <div
      className="mt-2 text-text-secondary prose"
      dangerouslySetInnerHTML={{ __html: job.description }}
    />
    <div className="mt-3 flex flex-wrap gap-2">
      {job.skillsUsed.map(skill => <span key={skill} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">{skill}</span>)}
    </div>
  </div>
);

const ExperienceSection: React.FC<{ data: ProfileData; }> = ({ data }) => {
  // Configure virtualization for experience
  const virtualizationConfig = useVirtualization(data.experience, {
    enabled: false, // Disable for timeline layout initially
    itemHeight: 200, // Approximate height of each experience item
    containerHeight: 600,
    threshold: 15, // Enable virtualization when > 15 experience entries
  });

  return (
    <AnimatedProfileSection
      title="Experience"
      id="experience"
      scrollAnimation={data.settings.animations.scrollAnimation}
      viewMode={data.settings.viewMode}
    >
      {virtualizationConfig.enabled ? (
        // Virtualized view for many experience entries
        <div className="relative">
          <VirtualizedList
            items={data.experience}
            itemHeight={virtualizationConfig.itemHeight}
            containerHeight={virtualizationConfig.containerHeight}
            className="max-w-full"
            renderItem={(job, index) => (
              <ExperienceItem job={job} index={index} />
            )}
          />
        </div>
      ) : (
        // Regular timeline view for fewer experience entries
        <div className="relative border-l-2 border-border-color pl-6 sm:pl-8 space-y-12">
          {data.experience.map((job, index) => (
            <ExperienceItem key={job.id} job={job} index={index} />
          ))}
        </div>
      )}
    </AnimatedProfileSection>
  );
};

export default ExperienceSection;
