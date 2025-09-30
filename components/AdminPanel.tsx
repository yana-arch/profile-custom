import React, { useState, useEffect } from 'react';
import { ProfileData } from '../types';
import Profile from './Profile';
import PersonalInfoSettings from './admin/tabs/PersonalInfoSettings';
import ExperienceSettings from './admin/tabs/ExperienceSettings';
import EducationSettings from './admin/tabs/EducationSettings';
import ProjectsSettings from './admin/tabs/ProjectsSettings';
import SkillsSettings from './admin/tabs/SkillsSettings';
import CertificationsSettings from './admin/tabs/CertificationsSettings';
import AwardsSettings from './admin/tabs/AwardsSettings';
import HobbiesSettings from './admin/tabs/HobbiesSettings';
import DisplaySettings from './admin/tabs/DisplaySettings';
import AnimationSettings from './admin/tabs/AnimationSettings';
import AiSettings from './admin/tabs/AiSettings';
import AiWizard from './admin/tabs/AiWizard';
import {
  UserIcon, BriefcaseIcon, AcademicCapIcon, CodeBracketIcon, WrenchScrewdriverIcon,
  CertificateIcon, TrophyIcon, HeartIcon, CogIcon, SparklesIcon, EyeIcon, PaintBrushIcon, ChevronDownIcon, EyeSlashIcon
} from './icons/Icons';

interface AdminPanelProps {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
  isViewOnly: boolean;
  setIsViewOnly: React.Dispatch<React.SetStateAction<boolean>>;
  initialTab: string;
}

type SectionName = 'content' | 'appearance' | 'ai';

const AdminPanel: React.FC<AdminPanelProps> = ({ data, setData, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [openSection, setOpenSection] = useState<SectionName | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  const contentTabs = [
    { id: 'personal', name: 'Personal Info', icon: UserIcon, component: <PersonalInfoSettings data={data} setData={setData} /> },
    { id: 'experience', name: 'Experience', icon: BriefcaseIcon, component: <ExperienceSettings data={data} setData={setData} /> },
    { id: 'education', name: 'Education', icon: AcademicCapIcon, component: <EducationSettings data={data} setData={setData} /> },
    { id: 'projects', name: 'Projects', icon: CodeBracketIcon, component: <ProjectsSettings data={data} setData={setData} /> },
    { id: 'skills', name: 'Skills', icon: WrenchScrewdriverIcon, component: <SkillsSettings data={data} setData={setData} /> },
    { id: 'certifications', name: 'Certifications', icon: CertificateIcon, component: <CertificationsSettings data={data} setData={setData} /> },
    { id: 'awards', name: 'Awards', icon: TrophyIcon, component: <AwardsSettings data={data} setData={setData} /> },
    { id: 'hobbies', name: 'Hobbies', icon: HeartIcon, component: <HobbiesSettings data={data} setData={setData} /> },
  ];

  const appearanceTabs = [
      { id: 'display', name: 'Display', icon: PaintBrushIcon, component: <DisplaySettings data={data} setData={setData} /> },
      { id: 'animations', name: 'Animations', icon: EyeIcon, component: <AnimationSettings data={data} setData={setData} /> },
  ];
  
  const aiTabs = [
    { id: 'ai-wizard', name: 'AI Wizard', icon: SparklesIcon, component: <AiWizard data={data} setData={setData} /> },
    { id: 'ai-settings', name: 'AI Settings', icon: CogIcon, component: <AiSettings data={data} setData={setData} /> },
  ];

  useEffect(() => {
    if (contentTabs.some(t => t.id === initialTab)) {
        setOpenSection('content');
    } else if (appearanceTabs.some(t => t.id === initialTab)) {
        setOpenSection('appearance');
    } else if (aiTabs.some(t => t.id === initialTab)) {
        setOpenSection('ai');
    } else {
        setOpenSection('content'); // Default to content
    }
  }, [initialTab]);
  
  const tabsWithoutPreview = ['ai-wizard', 'ai-settings'];
  const showPreview = isPreviewVisible && !tabsWithoutPreview.includes(activeTab);

  const toggleSection = (section: SectionName) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  const handleTabClick = (tabId: string, section: SectionName) => {
    setActiveTab(tabId);
    setOpenSection(section);
  };

  const renderTabContent = () => {
    const allTabs = [...contentTabs, ...appearanceTabs, ...aiTabs];
    const tab = allTabs.find(t => t.id === activeTab);
    return tab ? tab.component : null;
  };
  
  const TabButton: React.FC<{tab: {id: string; name: string; icon: React.ElementType}, currentTab: string, setTab: () => void}> = ({tab, currentTab, setTab}) => {
    const Icon = tab.icon;
    return (
       <button
          onClick={setTab}
          className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            currentTab === tab.id
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:bg-primary/10 hover:text-text-primary'
          }`}
        >
          <Icon className="w-5 h-5 mr-3" />
          <span>{tab.name}</span>
        </button>
    )
  }
  
  const AccordionSection: React.FC<{
    title: string;
    sectionName: SectionName;
    tabs: typeof contentTabs;
    children?: React.ReactNode;
  }> = ({ title, sectionName, tabs }) => (
    <div>
        <button
            onClick={() => toggleSection(sectionName)}
            className="w-full flex justify-between items-center px-2 py-2 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hover:bg-primary/5 rounded-md"
        >
            <span>{title}</span>
            <ChevronDownIcon className={`w-5 h-5 text-text-secondary/80 transition-transform ${openSection === sectionName ? 'rotate-180' : ''}`} />
        </button>
        {openSection === sectionName && (
            <div className="space-y-1 mt-2 animate-fadeIn">
                {tabs.map(tab => <TabButton key={tab.id} tab={tab} currentTab={activeTab} setTab={() => handleTabClick(tab.id, sectionName)} />)}
            </div>
        )}
    </div>
  );

  return (
    <div className="flex h-screen bg-background text-text-primary">
      {/* Admin UI Container */}
      <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ${showPreview ? 'w-full lg:w-[55%]' : 'w-full'}`}>
          <div className="flex flex-1 overflow-hidden">
            <aside className="w-64 bg-card-background border-r border-border-color p-4 flex-shrink-0 overflow-y-auto">
              <h2 className="text-xl font-bold text-text-primary mb-6 px-2">Admin Panel</h2>
              <nav className="space-y-2">
                  <AccordionSection title="Content" sectionName="content" tabs={contentTabs} />
                  <AccordionSection title="Appearance" sectionName="appearance" tabs={appearanceTabs} />
                  <AccordionSection title="AI Tools" sectionName="ai" tabs={aiTabs} />
              </nav>
            </aside>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
              <div className="absolute top-6 right-6 z-10 hidden lg:block">
                  <button 
                      onClick={() => setIsPreviewVisible(!isPreviewVisible)} 
                      className="p-2 rounded-full bg-card-background border border-border-color text-text-secondary hover:bg-primary/10 transition-colors"
                      aria-label={isPreviewVisible ? "Hide Preview" : "Show Preview"}
                  >
                      {isPreviewVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
              </div>
              <div className="max-w-4xl mx-auto">
                {renderTabContent()}
              </div>
            </main>
          </div>
      </div>

      {/* Live Preview Pane */}
      <div className={`h-full transition-all duration-300 ease-in-out overflow-hidden hidden lg:block ${showPreview ? 'w-[45%]' : 'w-0'}`}>
        <div className="bg-background p-4 h-full">
            <div className="h-full w-full bg-card-background rounded-lg shadow-lg border border-border-color overflow-y-auto">
                <Profile data={data} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
