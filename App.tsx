import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/lib/react-query';
import { ProfileData } from './types';
import { DEFAULT_PROFILE_DATA, getNewProfileData } from './constants';
import Profile from './components/Profile';
import Onboarding from './components/Onboarding';
import { UserMenu } from './src/components/auth/UserMenu';
import {
  SparklesIcon,
  ViewSimpleIcon,
  EyeIcon,
  CogIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from './components/icons/Icons';
import { initPerformanceMonitoring, getBundleSize, getMemoryUsage } from './utils/performance';
import { authService, AuthState } from './src/services/auth';
import { profileService } from './src/services/profile';
import { templateService } from './src/services/template';
import { supabase } from './src/lib/supabase';
import SEO from './components/common/SEO';

// Lazy load heavy components for better performance
const AdminPanel = lazy(() => import('./components/AdminPanel'));

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

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [isAdminView, setIsAdminView] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isNewUser, setIsNewUser] = useState(() => !localStorage.getItem('myDynamicProfileData'));
  const [initialAdminTab, setInitialAdminTab] = useState('personal');

  // Initialize performance monitoring
  useEffect(() => {
    initPerformanceMonitoring();

    // Log bundle size and memory usage in development
    if (process.env.NODE_ENV === 'development') {
      getBundleSize();
      getMemoryUsage();
    }
  }, []);

  // Subscribe to auth state
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((newAuthState) => {
      setAuthState(newAuthState);
    });

    return unsubscribe;
  }, []);

  // Load profile based on auth state
  useEffect(() => {
    const loadProfile = async () => {
      if (authState.loading) return;

      setIsLoadingProfile(true);
      try {
        if (authState.user) {
          try {
            // Try to load from database first
            const profile = await profileService.getDefaultProfile();
            if (profile && profile.data) {
              setProfileData(profile.data);
              setIsNewUser(false);
              return; // Success, exit
            }
          } catch (dbError) {
            console.warn('Database load failed, falling back to localStorage:', dbError);
          }

          // If DB load failed or no profile, try creating from localStorage
          try {
            const localData = localStorage.getItem('myDynamicProfileData');
            if (localData) {
              const parsedData = JSON.parse(localData);
              // Try DB creation, but don't fail if it doesn't work
              try {
                await profileService.createProfile(
                  parsedData.personalInfo?.name || 'My Profile',
                  parsedData,
                  undefined,
                  false,
                  true // Set as default
                );
                console.log('Successfully migrated profile to database');
              } catch (migrationError) {
                console.warn('Failed to migrate to database, continuing with localStorage:', migrationError);
              }
              // Always set data from localStorage
              setProfileData(parsedData);
              setIsNewUser(false);
            }
          } catch (localError) {
            console.error('Error loading from localStorage:', localError);
          }
        } else {
          // Not authenticated: load from localStorage only
          try {
            const localData = localStorage.getItem('myDynamicProfileData');
            if (localData) {
              setProfileData(JSON.parse(localData));
            }
          } catch (error) {
            console.error('Error loading local profile:', error);
          }
        }
      } catch (error) {
        console.error('Error in profile loading:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [authState]);

  useEffect(() => {
    // Don't save default data for a new user until they complete onboarding
    if (isNewUser) return;
    try {
      localStorage.setItem('myDynamicProfileData', JSON.stringify(profileData));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [profileData, isNewUser]);

  const { settings } = profileData;

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Update CSS custom properties directly on root element for better performance
    const shadowMap = {
      none: 'none',
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    };

    const boxShadow = shadowMap[settings.boxShadowStrength] || shadowMap.md;

    // Set CSS custom properties directly on document root
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    document.documentElement.style.setProperty('--background-color', settings.theme === 'dark' ? '#111827' : '#f9fafb');
    document.documentElement.style.setProperty(
      '--text-primary-color',
      settings.theme === 'dark' ? '#f9fafb' : '#111827'
    );
    document.documentElement.style.setProperty(
      '--text-secondary-color',
      settings.theme === 'dark' ? '#9ca3af' : '#4b5563'
    );
    document.documentElement.style.setProperty(
      '--card-background-color',
      settings.theme === 'dark' ? '#1f2937' : '#ffffff'
    );
    document.documentElement.style.setProperty('--border-color', settings.theme === 'dark' ? '#374151' : '#e5e7eb');
    document.documentElement.style.setProperty('--border-radius-base', `${settings.borderRadius}px`);
    document.documentElement.style.setProperty('--border-radius-sm', `${Math.max(2, settings.borderRadius * 0.75)}px`);
    document.documentElement.style.setProperty('--box-shadow-base', boxShadow);
    document.documentElement.style.setProperty('--transition-duration-base', `${settings.transitionDuration}ms`);
    document.documentElement.style.setProperty('font-family', `'${settings.fontFamily}', sans-serif`);

    // Update custom CSS if provided
    let customCssStyle = document.getElementById('custom-profile-css');
    if (!customCssStyle) {
      customCssStyle = document.createElement('style');
      customCssStyle.id = 'custom-profile-css';
      document.head.appendChild(customCssStyle);
    }
    customCssStyle.textContent = settings.customCss;
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

  const handleOnboardingComplete = useCallback((name: string, title: string, useAi: boolean) => {
    setProfileData(getNewProfileData(name, title));
    setIsNewUser(false);

    if (useAi) {
      setInitialAdminTab('ai-wizard');
      setIsAdminView(true);
    }
  }, []);

  const toggleViewMode = useCallback(() => {
    setProfileData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        viewMode: prev.settings.viewMode === 'enhanced' ? 'simple' : 'enhanced',
      },
    }));
  }, []);

  const memoizedProfile = useMemo(() => <Profile data={profileData} />, [profileData]);
  const memoizedAdminPanel = useMemo(
    () => (
      <AdminPanel
        data={profileData}
        setData={setProfileData}
        isViewOnly={isViewOnly}
        setIsViewOnly={setIsViewOnly}
        initialTab={initialAdminTab}
      />
    ),
    [profileData, isViewOnly, initialAdminTab]
  );

  if (authState.loading || isLoadingProfile) {
    return (
      <div className="bg-background flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-text-secondary">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (isNewUser) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (isViewOnly) {
    return (
      <div className="bg-background text-text-primary min-h-screen transition-colors duration-300 relative">
        {memoizedProfile}
        <button
          onClick={() => setIsViewOnly(false)}
          className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg z-50 hover:opacity-90 transition-opacity print-hidden"
          aria-label="Exit View Only Mode"
        >
          <ArrowsPointingInIcon className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background text-text-primary min-h-screen transition-colors duration-300">
      {/* SEO and Performance Monitoring */}
      {!isNewUser && <SEO data={profileData} />}

      {/* User Menu - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <UserMenu
          onProfileCreate={() => {
            // Handle profile creation - could open a modal or navigate to profile creation
            console.log('Create new profile');
          }}
          onProfileManage={() => {
            // Handle profile management - could open admin panel or profile list
            setIsAdminView(true);
          }}
        />
      </div>

      {!isAdminView && (
        <>
          <button
            onClick={toggleViewMode}
            className="fixed bottom-20 right-4 bg-secondary text-white p-3 rounded-full shadow-lg z-50 hover:opacity-90 transition-opacity print-hidden"
            aria-label={`Switch to ${settings.viewMode === 'enhanced' ? 'simple' : 'enhanced'} view`}
          >
            {settings.viewMode === 'enhanced' ? (
              <SparklesIcon className="h-6 w-6" />
            ) : (
              <ViewSimpleIcon className="h-6 w-6" />
            )}
          </button>
          <button
            onClick={() => setIsViewOnly(true)}
            className="fixed bottom-36 right-4 bg-secondary text-white p-3 rounded-full shadow-lg z-50 hover:opacity-90 transition-opacity print-hidden"
            aria-label="Enter View Only Mode"
          >
            <ArrowsPointingOutIcon className="h-6 w-6" />
          </button>
        </>
      )}

      <button
        onClick={() => setIsAdminView(!isAdminView)}
        className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg z-50 hover:opacity-90 transition-opacity print-hidden"
        aria-label="Toggle admin panel"
      >
        {isAdminView ? <EyeIcon className="h-6 w-6" /> : <CogIcon className="h-6 w-6" />}
      </button>

      {isAdminView ? (
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          {memoizedAdminPanel}
        </Suspense>
      ) : (
        memoizedProfile
      )}
    </div>
  );
};

export default App;
