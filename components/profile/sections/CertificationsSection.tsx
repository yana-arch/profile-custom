import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';
import { CertificateIcon } from '../../icons/Icons';

const getHoverClasses = (effect: 'none' | 'lift' | 'grow') => {
    if (effect === 'none') return '';
    const base = ''; // transition is now handled by dynamic-card
    if (effect === 'lift') return `${base} transform hover:-translate-y-1 hover:shadow-xl`;
    if (effect === 'grow') return `${base} transform hover:scale-[1.03]`;
    return '';
}

const CertificationsSection: React.FC<{ data: ProfileData; }> = ({ data }) => {
  const { animations, viewMode } = data.settings;
  const hoverEffect = viewMode === 'simple' ? 'none' : animations.hoverEffect;
  const cardClasses = `block bg-card-background group overflow-hidden dynamic-card ${getHoverClasses(hoverEffect)}`;
  const imageClasses = `w-full h-40 object-cover ${hoverEffect !== 'none' ? 'group-hover:scale-105 transition-transform duration-300' : ''}`;

  return (
    <AnimatedProfileSection 
        title="Certifications" 
        id="certifications" 
        scrollAnimation={animations.scrollAnimation}
        viewMode={viewMode}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.certifications.map(cert => (
          <a 
            key={cert.id} 
            href={cert.credentialUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cardClasses}
          >
            {cert.image ? (
                <img src={cert.image} alt={cert.name} className={imageClasses} />
            ) : (
                <div className="flex items-center justify-center h-40 bg-primary/5">
                    <CertificateIcon className="w-16 h-16 text-primary/40"/>
                </div>
            )}
            <div className="p-6">
              <h3 className="text-lg font-bold text-text-primary">{cert.name}</h3>
              <p className="text-text-secondary mt-1">{cert.issuingOrganization} - {cert.date}</p>
            </div>
          </a>
        ))}
      </div>
    </AnimatedProfileSection>
  );
};

export default CertificationsSection;
