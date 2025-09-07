import React, { useState, useRef } from 'react';
import { ProfileData } from '../types';
import Profile from './Profile';
import DisplaySettings from './admin/tabs/DisplaySettings';
import PersonalInfoSettings from './admin/tabs/PersonalInfoSettings';
import ExperienceSettings from './admin/tabs/ExperienceSettings';
import EducationSettings from './admin/tabs/EducationSettings';
import ProjectsSettings from './admin/tabs/ProjectsSettings';
import CertificationsSettings from './admin/tabs/CertificationsSettings';
import SkillsSettings from './admin/tabs/SkillsSettings';
import AnimationSettings from './admin/tabs/AnimationSettings';
import { DesktopComputerIcon, TabletIcon, DevicePhoneMobileIcon } from './icons/Icons';

type AdminPanelProps = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

const AdminPanel: React.FC<AdminPanelProps> = ({ data, setData }) => {
  const initialTabs = [
    { id: 'display', name: 'Display Settings' },
    { id: 'animations', name: 'Animations & Effects' },
    { id: 'personal', name: 'Personal Info' },
    { id: 'experience', name: 'Experience' },
    { id: 'education', name: 'Education' },
    { id: 'projects', name: 'Projects' },
    { id: 'certifications', name: 'Certifications' },
    { id: 'skills', name: 'Skills' },
  ];

  const [tabs, setTabs] = useState(initialTabs);
  const [activeTab, setActiveTab] = useState('display');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const dragItemIndex = useRef<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const previewSizes = {
    desktop: '100%',
    tablet: '768px',
    mobile: '390px',
  };

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, index: number) => {
    dragItemIndex.current = index;
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index: number) => {
    if (dragItemIndex.current === null || dragItemIndex.current === index) {
      return;
    }
    const newTabs = [...tabs];
    const draggedItemContent = newTabs.splice(dragItemIndex.current, 1)[0];
    newTabs.splice(index, 0, draggedItemContent);
    dragItemIndex.current = index;
    setTabs(newTabs);
  };
  
  const handleDragEnd = () => {
      dragItemIndex.current = null;
      setDraggedItem(null);
  };
  
  const renderActiveTabContent = () => {
    switch(activeTab) {
      case 'display':
        return <DisplaySettings data={data} setData={setData} />;
      case 'animations':
        return <AnimationSettings data={data} setData={setData} />;
      case 'personal':
        return <PersonalInfoSettings data={data} setData={setData} />;
      case 'experience':
        return <ExperienceSettings data={data} setData={setData} />;
      case 'education':
        return <EducationSettings data={data} setData={setData} />;
      case 'projects':
        return <ProjectsSettings data={data} setData={setData} />;
      case 'certifications':
        return <CertificationsSettings data={data} setData={setData} />;
      case 'skills':
        return <SkillsSettings data={data} setData={setData} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen bg-background text-text-primary">
      {/* Settings Panel */}
      <aside className="w-full md:w-[450px] bg-card-background/50 flex-shrink-0 h-full flex flex-col border-r border-border-color">
        <div className="p-4 border-b border-border-color">
          <h2 className="text-2xl font-bold text-text-primary">Admin Panel</h2>
        </div>
        <nav className="p-4 flex flex-col border-b border-border-color">
          {tabs.map((tab, index) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`text-left p-3 rounded-lg mb-2 transition-all duration-200 w-full
                ${activeTab === tab.id ? 'bg-primary text-white' : 'hover:bg-border-color text-text-secondary'}
                ${draggedItem === index ? 'opacity-50' : ''}
                cursor-grab active:cursor-grabbing
              `}>
              {tab.name}
            </button>
          ))}
        </nav>
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {renderActiveTabContent()}
        </div>
      </aside>

      {/* Live Preview Panel */}
      <main className="flex-1 hidden md:flex flex-col items-center justify-center p-8 bg-background overflow-hidden">
        <div className="w-full max-w-[1400px] h-full rounded-xl shadow-2xl bg-card-background border border-border-color overflow-hidden flex flex-col">
          <div className="h-10 bg-border-color/50 flex-shrink-0 flex items-center justify-between px-4 space-x-2">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center space-x-2">
                {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
                    <button 
                      key={mode} 
                      onClick={() => setPreviewMode(mode)} 
                      className={`p-1 rounded ${previewMode === mode ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-border-color'}`}
                      aria-label={`Preview on ${mode}`}
                    >
                        {mode === 'desktop' && <DesktopComputerIcon className="w-5 h-5" />}
                        {mode === 'tablet' && <TabletIcon className="w-5 h-5" />}
                        {mode === 'mobile' && <DevicePhoneMobileIcon className="w-5 h-5" />}
                    </button>
                ))}
            </div>
            <div className="w-12"></div> {/* Spacer to balance the controls */}
          </div>
          <div className="w-full flex-1 overflow-y-auto p-4 bg-background flex justify-center">
            <div 
              className="h-full bg-card-background shadow-lg transition-all duration-300 ease-in-out" 
              style={{ width: previewSizes[previewMode] }}
            >
              <div className="w-full h-full overflow-y-auto">
                <Profile data={data} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="flex-1 flex md:hidden items-center justify-center p-8 text-center text-text-secondary">
        <div>
          <h3 className="text-xl font-semibold">Live Preview</h3>
          <p className="mt-2">The live preview is available on larger screens. Please switch to a tablet or desktop to see your changes in real-time.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;