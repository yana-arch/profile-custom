import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';
import { CertificateIcon } from '../../icons/Icons';

const CertificationsSection: React.FC<{ data: ProfileData }> = ({ data }) => (
    <AnimatedProfileSection title="Certifications" id="certifications">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.certifications.map(cert => (
          <a 
            key={cert.id} 
            href={cert.credentialUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block bg-card-background rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
          >
            {cert.image ? (
                <img src={cert.image} alt={cert.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
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

export default CertificationsSection;
