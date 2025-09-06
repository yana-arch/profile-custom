import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';
import { CertificateIcon } from '../../icons/Icons';

const CertificationsSection: React.FC<{ data: ProfileData; animated: boolean; }> = ({ data, animated }) => {
  const cardClasses = `block bg-card-background rounded-lg shadow-md group overflow-hidden transition-all duration-300 ${animated ? 'hover:shadow-xl hover:-translate-y-1' : ''}`;
  const imageClasses = `w-full h-40 object-cover ${animated ? 'group-hover:scale-105 transition-transform duration-300' : ''}`;

  return (
    <AnimatedProfileSection title="Certifications" id="certifications" animated={animated}>
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