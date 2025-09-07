import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';
import { GitHubIcon, GlobeAltIcon } from '../../icons/Icons';

const getHoverClasses = (effect: 'none' | 'lift' | 'grow') => {
    if (effect === 'none') return '';
    const base = ''; // transition is now handled by dynamic-card
    if (effect === 'lift') return `${base} transform hover:-translate-y-1 hover:shadow-xl`;
    if (effect === 'grow') return `${base} transform hover:scale-[1.03]`;
    return '';
}

const generateImageSrcSet = (imageUrl: string, sizes: number[] = [400, 600, 800]): string => {
  if (!imageUrl || !imageUrl.includes('picsum.photos/seed/')) return '';
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/');
    if (parts.length < 5) return '';
    const seed = parts[2];
    const width = parseInt(parts[3], 10);
    const height = parseInt(parts[4], 10);
    if (isNaN(width) || isNaN(height) || width === 0) return '';

    const aspectRatio = height / width;
    return sizes
      .map(w => {
        const h = Math.round(w * aspectRatio);
        return `https://picsum.photos/seed/${seed}/${w}/${h} ${w}w`;
      })
      .join(', ');
  } catch (e) {
    return '';
  }
};


const ProjectsSection: React.FC<{ data: ProfileData; }> = ({ data }) => {
  const { animations, viewMode } = data.settings;
  const hoverEffect = viewMode === 'simple' ? 'none' : animations.hoverEffect;

  const cardClasses = `project-card bg-card-background overflow-hidden group dynamic-card ${getHoverClasses(hoverEffect)}`;
  const imageClasses = `w-full h-48 object-cover ${hoverEffect !== 'none' ? 'group-hover:scale-105 transition-transform duration-300' : ''}`;

  return (
    <AnimatedProfileSection 
        title="Projects" 
        id="projects" 
        scrollAnimation={animations.scrollAnimation}
        viewMode={viewMode}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.projects.map(project => (
          <div key={project.id} className={cardClasses}>
            <img 
                src={project.image} 
                srcSet={generateImageSrcSet(project.image)}
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                alt={project.name} 
                className={imageClasses} 
                loading="lazy"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-text-primary mb-2">{project.name}</h3>
              <div 
                className="text-text-secondary mb-4 prose"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
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
};

export default ProjectsSection;