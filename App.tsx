
import React, { useState, useEffect, useMemo } from 'react';
import { ProfileData } from './types';
import { DEFAULT_PROFILE_DATA } from './constants';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    try {
      const savedData = localStorage.getItem('myDynamicProfileData');
      return savedData ? JSON.parse(savedData) : DEFAULT_PROFILE_DATA;
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return DEFAULT_PROFILE_DATA;
    }
  });

  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('myDynamicProfileData', JSON.stringify(profileData));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [profileData]);

  const { settings } = profileData;

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --primary-color: ${settings.primaryColor};
        --secondary-color: ${settings.secondaryColor};
        --background-color: ${settings.theme === 'dark' ? '#111827' : '#f9fafb'};
        --text-primary-color: ${settings.theme === 'dark' ? '#f9fafb' : '#111827'};
        --text-secondary-color: ${settings.theme === 'dark' ? '#9ca3af' : '#4b5563'};
        --card-background-color: ${settings.theme === 'dark' ? '#1f2937' : '#ffffff'};
        --border-color: ${settings.theme === 'dark' ? '#374151' : '#e5e7eb'};
        font-family: '${settings.fontFamily}', sans-serif;
      }
    `;
    document.head.appendChild(style);

    const customCssStyle = document.getElementById('custom-profile-css') || document.createElement('style');
    customCssStyle.id = 'custom-profile-css';
    customCssStyle.innerHTML = settings.customCss;
    document.head.appendChild(customCssStyle);

    return () => {
      document.head.removeChild(style);
      if (document.head.contains(customCssStyle)) {
          document.head.removeChild(customCssStyle);
      }
    };
  }, [settings]);

  // Add Google Font link to head
  useEffect(() => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(' ', '+')}:wght@300;400;500;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [settings.fontFamily]);

  const memoizedProfile = useMemo(() => <Profile data={profileData} />, [profileData]);
  const memoizedAdminPanel = useMemo(() => <AdminPanel data={profileData} setData={setProfileData} />, [profileData]);


  return (
    <div className="bg-background text-text-primary min-h-screen transition-colors duration-300">
      <button
        onClick={() => setIsAdminView(!isAdminView)}
        className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg z-50 hover:opacity-90 transition-opacity"
        aria-label="Toggle admin panel"
      >
        {isAdminView ? (
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        )}
      </button>

      {isAdminView ? memoizedAdminPanel : memoizedProfile}
    </div>
  );
};

export default App;
