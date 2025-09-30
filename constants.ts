import { ProfileData } from './types';
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_PROFILE_DATA: ProfileData = {
  personalInfo: {
    name: "Alex Doe",
    title: "Full-Stack Web Developer",
    avatar: "https://i.pravatar.cc/300?u=a042581f4e29026704d",
    heroImage: "https://picsum.photos/seed/picsum/2000/1333",
    bio: "I'm a passionate full-stack developer with experience in building modern web applications with React, Node.js, and TypeScript. I love solving complex problems and learning new technologies.",
    contact: {
      email: "alex.doe@example.com",
      linkedin: "https://www.linkedin.com/",
      github: "https://github.com/",
      portfolio: "https://example.com"
    },
    cvFileUrl: ""
  },
  experience: [
    {
      id: uuidv4(),
      title: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      startDate: "Jan 2020",
      endDate: "Present",
      description: "<ul><li>Led the development of a new microservices-based architecture, improving system scalability by 50%.</li><li>Mentored junior developers and conducted code reviews to ensure code quality and consistency.</li></ul>",
      skillsUsed: ["React", "Node.js", "TypeScript", "AWS"]
    },
    {
      id: uuidv4(),
      title: "Software Engineer",
      company: "Web Innovators",
      startDate: "Jun 2017",
      endDate: "Dec 2019",
      description: "<p>Developed and maintained client-facing web applications using Angular and .NET Core. Collaborated with cross-functional teams to deliver high-quality software solutions.</p>",
      skillsUsed: ["Angular", ".NET Core", "SQL Server"]
    }
  ],
  education: [
    {
      id: uuidv4(),
      school: "University of Technology",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2013",
      endDate: "2017",
      description: "<p>Graduated with honors. Active member of the coding club and participated in several hackathons.</p>"
    }
  ],
  projects: [
    {
      id: uuidv4(),
      name: "E-commerce Platform",
      description: "<p>A full-featured e-commerce platform with a React-based frontend and a Node.js backend. Implemented features like product search, shopping cart, and Stripe integration for payments.</p>",
      image: "https://picsum.photos/seed/project1/800/600",
      repoLink: "https://github.com/",
      demoLink: "https://example.com",
      tags: ["React", "Node.js", "Stripe"]
    },
    {
      id: uuidv4(),
      name: "Project Management Tool",
      description: "<p>A Kanban-style project management tool built with Vue.js and Firebase. Allows users to create boards, lists, and cards to manage their tasks and workflows.</p>",
      image: "https://picsum.photos/seed/project2/800/600",
      repoLink: "https://github.com/",
      demoLink: "https://example.com",
      tags: ["Vue.js", "Firebase", "Kanban"]
    }
  ],
  skills: {
    frontend: [
      { id: uuidv4(), name: "React", level: 95, icon: 'react' },
      { id: uuidv4(), name: "TypeScript", level: 90, icon: 'typescript' },
      { id: uuidv4(), name: "Vue.js", level: 80, icon: 'vue' },
    ],
    backend: [
      { id: uuidv4(), name: "Node.js", level: 90, icon: 'nodejs' },
      { id: uuidv4(), name: "Python", level: 75, icon: 'python' },
    ],
    tools: [
      { id: uuidv4(), name: "Docker", level: 85, icon: 'docker' },
      { id: uuidv4(), name: "AWS", level: 70, icon: 'aws' },
    ]
  },
  certifications: [
    {
      id: uuidv4(),
      name: "AWS Certified Cloud Practitioner",
      issuingOrganization: "Amazon Web Services",
      date: "2022",
      credentialUrl: "https://www.credly.com/your-badge",
      image: "https://picsum.photos/seed/cert1/400/300"
    }
  ],
  hobbies: [],
  awards: [],
  settings: {
    layout: 'scroll',
    theme: 'dark',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    fontFamily: 'Roboto',
    borderRadius: 8,
    boxShadowStrength: 'md',
    transitionDuration: 300,
    customCss: "",
    viewMode: 'enhanced',
    sections: {
      about: true,
      experience: true,
      education: true,
      projects: true,
      skills: true,
      certifications: true,
      hobbies: true,
      awards: true,
      contact: true
    },
    animations: {
      scrollAnimation: 'fadeIn',
      hoverEffect: 'lift'
    },
    ai: {
      provider: 'gemini',
      apiKey: '',
      openRouterModel: 'google/gemini-pro',
      customApiUrl: '',
      customModel: ''
    }
  }
};

export const getNewProfileData = (name: string, title: string): ProfileData => ({
  ...DEFAULT_PROFILE_DATA,
  personalInfo: {
    ...DEFAULT_PROFILE_DATA.personalInfo,
    name: name || "Your Name",
    title: title || "Your Title",
    avatar: "",
    heroImage: "",
    bio: `Welcome to my new profile! I'm a ${title || 'professional'} looking for new opportunities.`,
    contact: {
      email: "",
      linkedin: "",
      github: "",
      portfolio: ""
    },
    cvFileUrl: ""
  },
  experience: [],
  education: [],
  projects: [],
  skills: {
    frontend: [],
    backend: [],
    tools: []
  },
  certifications: [],
  hobbies: [],
  awards: [],
});