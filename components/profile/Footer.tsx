import React from 'react';
import { ProfileData } from '../../types';

const Footer: React.FC<{ data: ProfileData }> = ({ data }) => (
  <footer className="bg-card-background border-t border-border-color py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-secondary">
      <p>&copy; {new Date().getFullYear()} {data.personalInfo.name}. All Rights Reserved.</p>
    </div>
  </footer>
);

export default Footer;
