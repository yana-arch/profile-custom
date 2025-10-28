import React, { useState, useEffect } from 'react';
import { ProfileData } from '../../../types';
import { generateProfilePDF } from '../../../utils/pdfExport';
import { generateProfilePPTFromData } from '../../../utils/pptExport';
import {
  UserIcon,
  BriefcaseIcon,
  CodeBracketIcon,
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  PaperAirplaneIcon,
  CertificateIcon,
  DocumentArrowDownIcon,
  HeartIcon,
  TrophyIcon,
  ChevronDownIcon,
} from '../../icons/Icons';
import Footer from '../Footer';
import AboutSection from '../sections/AboutSection';
import ExperienceSection from '../sections/ExperienceSection';
import EducationSection from '../sections/EducationSection';
import ProjectsSection from '../sections/ProjectsSection';
import SkillsSection from '../sections/SkillsSection';
import CertificationsSection from '../sections/CertificationsSection';
import HobbiesSection from '../sections/HobbiesSection';
import AwardsSection from '../sections/AwardsSection';
import ContactSection from '../sections/ContactSection';

const TabView: React.FC<{ data: ProfileData }> = ({ data }) => {
  const allTabs = [
    { id: 'about', name: 'About', icon: <UserIcon className="w-5 h-5 mr-2" /> },
    { id: 'experience', name: 'Experience', icon: <BriefcaseIcon className="w-5 h-5 mr-2" /> },
    { id: 'education', name: 'Education', icon: <AcademicCapIcon className="w-5 h-5 mr-2" /> },
    { id: 'projects', name: 'Projects', icon: <CodeBracketIcon className="w-5 h-5 mr-2" /> },
    { id: 'skills', name: 'Skills', icon: <WrenchScrewdriverIcon className="w-5 h-5 mr-2" /> },
    { id: 'certifications', name: 'Certifications', icon: <CertificateIcon className="w-5 h-5 mr-2" /> },
    { id: 'awards', name: 'Awards', icon: <TrophyIcon className="w-5 h-5 mr-2" /> },
    { id: 'hobbies', name: 'Hobbies', icon: <HeartIcon className="w-5 h-5 mr-2" /> },
    { id: 'contact', name: 'Contact', icon: <PaperAirplaneIcon className="w-5 h-5 mr-2" /> },
  ];

  const contentAvailable = {
    about: true,
    experience: data.experience.length > 0,
    education: data.education.length > 0,
    projects: data.projects.length > 0,
    skills: data.skills.frontend.length > 0 || data.skills.backend.length > 0 || data.skills.tools.length > 0,
    certifications: data.certifications.length > 0,
    awards: data.awards.length > 0,
    hobbies: data.hobbies.length > 0,
    contact: true,
  };

  const visibleTabs = allTabs.filter(
    (tab) =>
      data.settings.sections[tab.id as keyof typeof data.settings.sections] &&
      contentAvailable[tab.id as keyof typeof contentAvailable]
  );

  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id || '');
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  // Reset active tab if it's been disabled or has no content
  useEffect(() => {
    if (!visibleTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(visibleTabs[0]?.id || '');
    }
  }, [data, activeTab, visibleTabs]);

  const handleDownloadPDF = async () => {
    setIsExportDropdownOpen(false);
    try {
      await generateProfilePDF(data);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownloadPPT = async () => {
    setIsExportDropdownOpen(false);
    try {
      await generateProfilePPTFromData(data);
    } catch (error) {
      console.error('PPT generation failed:', error);
      alert('Failed to generate PPT. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 gap-4">
        <div className="flex items-center">
          <img src={data.personalInfo.avatar} alt="avatar" className="w-12 h-12 rounded-full mr-4" loading="lazy" />
          <h1 className="text-2xl font-bold text-text-primary">{data.personalInfo.name}</h1>
        </div>
        <div className="flex gap-2">
          {data.personalInfo.cvFileUrl && (
            <a
              href={data.personalInfo.cvFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dynamic-button bg-primary hover:opacity-90 text-white font-bold py-2 px-4 flex items-center"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
              CV
            </a>
          )}
        </div>
      </header>

      {/* Export Dropdown - Fixed Position */}
      <div className="fixed bottom-52 left-4 z-50 print-hidden">
        <button
          onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-colors flex items-center"
          title="Export options"
        >
          <DocumentArrowDownIcon className="h-6 w-6" />
          <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isExportDropdownOpen && (
          <>
            {/* Backdrop to close dropdown */}
            <button
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsExportDropdownOpen(false)}
              aria-label="Close export menu"
            />

            {/* Dropdown menu */}
            <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 min-w-48 z-50">
              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-100"
              >
                <div className="w-4 h-4 bg-green-600 rounded mr-3 flex items-center justify-center">
                  <DocumentArrowDownIcon className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">Download as PDF</span>
              </button>

              <button
                onClick={handleDownloadPPT}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700"
              >
                <div className="w-4 h-4 bg-blue-600 rounded mr-3 flex items-center justify-center">
                  <DocumentArrowDownIcon className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">Export as PPT</span>
              </button>
            </div>
          </>
        )}
      </div>

      <nav className="flex flex-wrap gap-2 bg-card-background p-2 rounded-lg shadow-sm mb-8">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium flex items-center flex-shrink-0 dynamic-button-sm ${activeTab === tab.id ? 'bg-primary text-white' : 'text-text-secondary hover:bg-border-color'}`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </nav>
      <main>
        {activeTab === 'about' && <AboutSection data={data} />}
        {activeTab === 'experience' && <ExperienceSection data={data} />}
        {activeTab === 'education' && <EducationSection data={data} />}
        {activeTab === 'projects' && <ProjectsSection data={data} />}
        {activeTab === 'skills' && <SkillsSection data={data} />}
        {activeTab === 'certifications' && <CertificationsSection data={data} />}
        {activeTab === 'awards' && <AwardsSection data={data} />}
        {activeTab === 'hobbies' && <HobbiesSection data={data} />}
        {activeTab === 'contact' && <ContactSection data={data} />}
      </main>
      <Footer data={data} />
    </div>
  );
};

export default TabView;
