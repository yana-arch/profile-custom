import React, { useState, useEffect, useMemo } from 'react';
import { ProfileData } from './types';
import { DEFAULT_PROFILE_DATA } from './constants';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import { SparklesIcon, ViewSimpleIcon } from './components/icons/Icons';

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

    const shadowMap = {
      'none': 'none',
      'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    };
    
    const boxShadow = shadowMap[settings.boxShadowStrength] || shadowMap.md;

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
        --border-radius-base: ${settings.borderRadius}px;
        --border-radius-sm: ${Math.max(2, settings.borderRadius * 0.75)}px;
        --box-shadow-base: ${boxShadow};
        --transition-duration-base: ${settings.transitionDuration}ms;
      }

      .dynamic-card {
        border-radius: var(--border-radius-base);
        box-shadow: var(--box-shadow-base);
        transition: all var(--transition-duration-base) ease-in-out;
      }

      .dynamic-button {
        border-radius: var(--border-radius-base);
        transition: all var(--transition-duration-base) ease-in-out;
      }
      
      .dynamic-button-sm {
        border-radius: var(--border-radius-sm);
        transition: all var(--transition-duration-base) ease-in-out;
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

  const toggleViewMode = () => {
    setProfileData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        viewMode: prev.settings.viewMode === 'enhanced' ? 'simple' : 'enhanced'
      }
    }));
  }

  const memoizedProfile = useMemo(() => <Profile data={profileData} />, [profileData]);
  const memoizedAdminPanel = useMemo(() => <AdminPanel data={profileData} setData={setProfileData} />, [profileData]);


  return (
    <div className="bg-background text-text-primary min-h-screen transition-colors duration-300">
      {!isAdminView && (
        <button
          onClick={toggleViewMode}
          className="fixed bottom-20 right-4 bg-secondary text-white p-3 rounded-full shadow-lg z-50 hover:opacity-90 transition-opacity"
          aria-label={`Switch to ${settings.viewMode === 'enhanced' ? 'simple' : 'enhanced'} view`}
        >
          {settings.viewMode === 'enhanced' ? <SparklesIcon className="h-6 w-6" /> : <ViewSimpleIcon className="h-6 w-6" />}
        </button>
      )}

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
