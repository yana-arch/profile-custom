import React, { useState, useEffect } from 'react';
import { ProfileData } from '../../../types';
import {
  UserIcon, BriefcaseIcon, CodeBracketIcon, WrenchScrewdriverIcon, AcademicCapIcon, PaperAirplaneIcon,
  CertificateIcon, DocumentArrowDownIcon
} from '../../icons/Icons';
import Footer from '../Footer';
import AboutSection from '../sections/AboutSection';
import ExperienceSection from '../sections/ExperienceSection';
import EducationSection from '../sections/EducationSection';
import ProjectsSection from '../sections/ProjectsSection';
import SkillsSection from '../sections/SkillsSection';
import CertificationsSection from '../sections/CertificationsSection';
import ContactSection from '../sections/ContactSection';


const TabView: React.FC<{ data: ProfileData }> = ({ data }) => {
    const allTabs = [
      { id: 'about', name: 'About', icon: <UserIcon className="w-5 h-5 mr-2" /> },
      { id: 'experience', name: 'Experience', icon: <BriefcaseIcon className="w-5 h-5 mr-2" /> },
      { id: 'education', name: 'Education', icon: <AcademicCapIcon className="w-5 h-5 mr-2" /> },
      { id: 'projects', name: 'Projects', icon: <CodeBracketIcon className="w-5 h-5 mr-2" /> },
      { id: 'skills', name: 'Skills', icon: <WrenchScrewdriverIcon className="w-5 h-5 mr-2" /> },
      { id: 'certifications', name: 'Certifications', icon: <CertificateIcon className="w-5 h-5 mr-2" /> },
      { id: 'contact', name: 'Contact', icon: <PaperAirplaneIcon className="w-5 h-5 mr-2" /> },
    ];
    
    const visibleTabs = allTabs.filter(tab => data.settings.sections[tab.id as keyof typeof data.settings.sections]);
    const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id || '');

    // Reset active tab if it's been disabled
    useEffect(() => {
        if (!visibleTabs.some(tab => tab.id === activeTab)) {
            setActiveTab(visibleTabs[0]?.id || '');
        }
    }, [data.settings.sections, activeTab, visibleTabs]);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <header className="flex items-center justify-between py-6">
                <div className="flex items-center">
                    <img src={data.personalInfo.avatar} alt="avatar" className="w-12 h-12 rounded-full mr-4"/>
                    <h1 className="text-2xl font-bold text-text-primary">{data.personalInfo.name}</h1>
                </div>
                 {data.personalInfo.cvFileUrl && (
                  <a href={data.personalInfo.cvFileUrl} target="_blank" rel="noopener noreferrer" className="bg-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center">
                    <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                    CV
                  </a>
                )}
            </header>
            <nav className="flex items-center space-x-2 bg-card-background p-2 rounded-lg shadow-sm mb-8 overflow-x-auto">
                {visibleTabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center flex-shrink-0 ${activeTab === tab.id ? 'bg-primary text-white' : 'text-text-secondary hover:bg-border-color'}`}>
                        {tab.icon} {tab.name}
                    </button>
                ))}
            </nav>
            <main>
              {activeTab === 'about' && data.settings.sections.about && <AboutSection data={data} />}
              {activeTab === 'experience' && data.settings.sections.experience && <ExperienceSection data={data} />}
              {activeTab === 'education' && data.settings.sections.education && <EducationSection data={data} />}
              {activeTab === 'projects' && data.settings.sections.projects && <ProjectsSection data={data} />}
              {activeTab === 'skills' && data.settings.sections.skills && <SkillsSection data={data} />}
              {activeTab === 'certifications' && data.settings.sections.certifications && <CertificationsSection data={data} />}
              {activeTab === 'contact' && data.settings.sections.contact && <ContactSection data={data} />}
            </main>
            <Footer data={data} />
        </div>
    );
}

export default TabView;
