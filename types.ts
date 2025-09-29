export interface PersonalInfo {
  name: string;
  title: string;
  avatar: string;
  heroImage: string;
  bio: string;
  contact: {
    email: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  cvFileUrl: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  skillsUsed: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  repoLink: string;
  demoLink: string;
  tags: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  icon?: string;
}

export interface Skills {
  frontend: Skill[];
  backend: Skill[];
  tools: Skill[];
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  date: string;
  credentialUrl: string;
  image?: string;
}

export interface AnimationSettings {
  scrollAnimation: 'none' | 'fadeIn' | 'slideUp';
  hoverEffect: 'none' | 'lift' | 'grow';
}

export interface AiSettings {
  provider: 'gemini' | 'openrouter' | 'custom';
  apiKey: string;
  openRouterModel?: string;
  customApiUrl?: string;
  customModel?: string;
}

export interface Settings {
  layout: 'scroll' | 'tab' | 'slide';
  theme: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: number;
  boxShadowStrength: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  transitionDuration: number;
  customCss: string;
  viewMode: 'enhanced' | 'simple';
  sections: {
    about: boolean;
    experience: boolean;
    education: boolean;
    projects: boolean;
    skills: boolean;
    certifications: boolean;
    contact: boolean;
  };
  animations: AnimationSettings;
  ai: AiSettings;
}

export interface ProfileData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skills;
  certifications: Certification[];
  settings: Settings;
}