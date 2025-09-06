export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  heroImage: string;
  cvFileUrl: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
}

export interface Experience {
  id: string;
  company: string;
  title: string;
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
  demoLink: string;
  repoLink: string;
  image: string;
  tags: string[];
}

export interface Certification {
    id: string;
    name: string;
    issuingOrganization: string;
    date: string;
    credentialUrl: string;
    image?: string;
}


export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface Skills {
  frontend: Skill[];
  backend: Skill[];
  tools: Skill[];
}

export interface Settings {
  layout: 'scroll' | 'tab' | 'slide';
  theme: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  customCss: string;
  sections: {
      about: boolean;
      experience: boolean;
      education: boolean;
      projects: boolean;
      skills: boolean;
      certifications: boolean;
      contact: boolean;
  }
}

export interface ProfileData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  skills: Skills;
  settings: Settings;
}