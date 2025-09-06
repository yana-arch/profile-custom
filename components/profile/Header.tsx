import React from 'react';
import { ProfileData } from '../../types';
import { DocumentArrowDownIcon } from '../icons/Icons';

const Header: React.FC<{ data: ProfileData }> = ({ data }) => (
  <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-40 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <div className="flex items-center">
           <img src={data.personalInfo.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-4"/>
           <span className="text-xl font-bold text-text-primary">{data.personalInfo.name}</span>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          {Object.entries(data.settings.sections).filter(([, visible]) => visible).map(([key]) => (
            <a key={key} href={`#${key}`} className="text-text-secondary hover:text-primary transition-colors font-medium capitalize">{key}</a>
          ))}
        </nav>
        {data.personalInfo.cvFileUrl && (
          <a href={data.personalInfo.cvFileUrl} target="_blank" rel="noopener noreferrer" className="bg-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center">
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            CV
          </a>
        )}
      </div>
    </div>
  </header>
);

export default Header;
