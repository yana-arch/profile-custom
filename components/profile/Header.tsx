import React, { useState } from 'react';
import { ProfileData } from '../../types';
import { DocumentArrowDownIcon, Bars3Icon, XMarkIcon } from '../icons/Icons';

const Header: React.FC<{ data: ProfileData }> = ({ data }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
          <div className="flex items-center">
            {data.personalInfo.cvFileUrl && (
              <a href={data.personalInfo.cvFileUrl} target="_blank" rel="noopener noreferrer" className="dynamic-button bg-primary hover:opacity-90 text-white font-bold py-2 px-4 flex items-center">
                <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">CV</span>
              </a>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-4 md:hidden text-text-primary"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm absolute w-full shadow-lg">
          <nav className="flex flex-col items-center space-y-4 p-4">
            {Object.entries(data.settings.sections).filter(([, visible]) => visible).map(([key]) => (
              <a key={key} href={`#${key}`} onClick={() => setIsMobileMenuOpen(false)} className="text-text-secondary hover:text-primary transition-colors font-medium capitalize">{key}</a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;