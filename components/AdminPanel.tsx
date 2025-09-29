import React, { useState } from 'react';
import { ProfileData } from '../types';
import PersonalInfoSettings from './admin/tabs/PersonalInfoSettings';
import ExperienceSettings from './admin/tabs/ExperienceSettings';
import EducationSettings from './admin/tabs/EducationSettings';
import ProjectsSettings from './admin/tabs/ProjectsSettings';
import SkillsSettings from './admin/tabs/SkillsSettings';
import CertificationsSettings from './admin/tabs/CertificationsSettings';
import DisplaySettings from './admin/tabs/DisplaySettings';
import AnimationSettings from './admin/tabs/AnimationSettings';
import AiSettings from './admin/tabs/AiSettings';
import AiWizard from './admin/tabs/AiWizard';
import { UserIcon, BriefcaseIcon, AcademicCapIcon, CodeBracketIcon, WrenchScrewdriverIcon, CertificateIcon, EyeIcon, SparklesIcon, CogIcon } from './icons/Icons';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
  isViewOnly: boolean;
  setIsViewOnly: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminPanel: React.FC<Props> = ({ data, setData, isViewOnly, setIsViewOnly }) => {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <UserIcon className="w-5 h-5 mr-2" /> },
    { id: 'experience', label: 'Experience', icon: <BriefcaseIcon className="w-5 h-5 mr-2" /> },
    { id: 'education', label: 'Education', icon: <AcademicCapIcon className="w-5 h-5 mr-2" /> },
    { id: 'projects', label: 'Projects', icon: <CodeBracketIcon className="w-5 h-5 mr-2" /> },
    { id: 'skills', label: 'Skills', icon: <WrenchScrewdriverIcon className="w-5 h-5 mr-2" /> },
    { id: 'certifications', label: 'Certifications', icon: <CertificateIcon className="w-5 h-5 mr-2" /> },
    { id: 'display', label: 'Display', icon: <EyeIcon className="w-5 h-5 mr-2" /> },
    { id: 'animations', label: 'Animations', icon: <SparklesIcon className="w-5 h-5 mr-2" /> },
    { id: 'ai-wizard', label: 'AI Wizard', icon: <SparklesIcon className="w-5 h-5 mr-2" /> },
    { id: 'ai', label: 'AI Settings', icon: <CogIcon className="w-5 h-5 mr-2" /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal': return <PersonalInfoSettings data={data} setData={setData} />;
      case 'experience': return <ExperienceSettings data={data} setData={setData} />;
      case 'education': return <EducationSettings data={data} setData={setData} />;
      case 'projects': return <ProjectsSettings data={data} setData={setData} />;
      case 'skills': return <SkillsSettings data={data} setData={setData} />;
      case 'certifications': return <CertificationsSettings data={data} setData={setData} />;
      case 'display': return <DisplaySettings data={data} setData={setData} />;
      case 'animations': return <AnimationSettings data={data} setData={setData} />;
      case 'ai-wizard': return <AiWizard data={data} setData={setData} />;
      case 'ai': return <AiSettings data={data} setData={setData} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="w-full md:w-64 bg-card-background border-b md:border-b-0 md:border-r border-border-color p-4 md:p-6 print-hidden">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Admin Panel</h2>
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-border-color/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;