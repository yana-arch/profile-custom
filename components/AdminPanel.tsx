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

type AdminPanelProps = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

const AdminPanel: React.FC<AdminPanelProps> = ({ data, setData }) => {
  const initialTabs = [
    { id: 'display', name: 'Display Settings' },
    { id: 'personal', name: 'Personal Info' },
    { id: 'experience', name: 'Experience' },
    { id: 'education', name: 'Education' },
    { id: 'projects', name: 'Projects' },
    { id: 'certifications', name: 'Certifications' },
    { id: 'skills', name: 'Skills' },
  ];

  const [tabs, setTabs] = useState(initialTabs);
  const [activeTab, setActiveTab] = useState('display');
  const dragItemIndex = useRef<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

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
        <nav className="p-4 flex flex-row md:flex-col overflow-x-auto border-b border-border-color">
          {tabs.map((tab, index) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`text-left p-3 rounded-lg mb-2 whitespace-nowrap transition-all duration-200 w-full md:w-auto 
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
      <main className="flex-1 hidden md:flex items-center justify-center p-8 bg-background overflow-hidden">
        <div className="w-full h-full rounded-xl shadow-2xl bg-card-background border border-border-color overflow-hidden">
          <div className="h-8 bg-border-color/50 flex items-center px-4 space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="w-full h-[calc(100%-2rem)] overflow-y-auto">
            <Profile data={data} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
