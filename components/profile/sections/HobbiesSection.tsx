import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';
import { HeartIcon } from '../../icons/Icons';

const getHoverClasses = (effect: 'none' | 'lift' | 'grow') => {
    if (effect === 'none') return '';
    const base = ''; // transition is now handled by dynamic-card
    if (effect === 'lift') return `${base} transform hover:-translate-y-1 hover:shadow-xl`;
    if (effect === 'grow') return `${base} transform hover:scale-[1.03]`;
    return '';
}

const HobbiesSection: React.FC<{ data: ProfileData; }> = ({ data }) => {
  const { animations, viewMode } = data.settings;
  const hoverEffect = viewMode === 'simple' ? 'none' : animations.hoverEffect;
  const cardClasses = `block bg-card-background group overflow-hidden dynamic-card ${getHoverClasses(hoverEffect)}`;
  const imageClasses = `w-full h-40 object-cover ${hoverEffect !== 'none' ? 'group-hover:scale-105 transition-transform duration-300' : ''}`;

  return (
    <AnimatedProfileSection 
        title="Hobbies & Interests" 
        id="hobbies" 
        scrollAnimation={animations.scrollAnimation}
        viewMode={viewMode}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.hobbies.map(hobby => (
          <div 
            key={hobby.id} 
            className={cardClasses}
          >
            {hobby.image ? (
                <img 
                    src={hobby.image} 
                    alt={hobby.name} 
                    className={imageClasses} 
                    loading="lazy"
                />
            ) : (
                <div className="flex items-center justify-center h-40 bg-secondary/5">
                    <HeartIcon className="w-16 h-16 text-secondary/40"/>
                </div>
            )}
            <div className="p-6">
              <h3 className="text-lg font-bold text-text-primary">{hobby.name}</h3>
              <p className="text-text-secondary mt-1">{hobby.description}</p>
              {hobby.link && (
                 <a href={hobby.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm mt-2 inline-block">Learn More</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </AnimatedProfileSection>
  );
};

export default HobbiesSection;