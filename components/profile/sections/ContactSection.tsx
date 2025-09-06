import React from 'react';
import { ProfileData } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';

const ContactSection: React.FC<{ data: ProfileData; animated: boolean; }> = ({ data, animated }) => (
  <AnimatedProfileSection title="Contact" id="contact" animated={animated}>
    <div className="text-center max-w-2xl mx-auto">
      <p className="text-lg text-text-secondary mb-8">
        I'm currently open to new opportunities. Feel free to reach out via email or connect with me on social media.
      </p>
      <a href={`mailto:${data.personalInfo.contact.email}`} className="bg-primary hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-lg">
        Say Hello
      </a>
    </div>
  </AnimatedProfileSection>
);

export default ContactSection;