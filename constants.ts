import { ProfileData } from './types';
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_PROFILE_DATA: ProfileData = {
  personalInfo: {
    name: "Nguyen Van A",
    title: "Frontend Developer",
    bio: "A passionate Frontend Developer with experience in building responsive and user-friendly web applications using modern technologies like React, TypeScript, and Tailwind CSS. Always eager to learn and adapt to new challenges.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    heroImage: "https://picsum.photos/seed/hero/1200/600",
    cvFileUrl: "#", // Placeholder for CV download link
    contact: {
      email: "nguyenvana@example.com",
      phone: "+84 123 456 789",
      linkedin: "https://linkedin.com/in/nguyenvana",
      github: "https://github.com/nguyenvana",
      portfolio: "https://portfolio.example.com",
    },
  },
  experience: [
    {
      id: uuidv4(),
      company: "GlobalTech Solutions",
      title: "Senior Frontend Developer",
      startDate: "2021",
      endDate: "Present",
      description: "Leading the development of a new client-facing dashboard. Mentoring junior developers and conducting code reviews to ensure code quality and consistency.",
      skillsUsed: ["React", "TypeScript", "Redux"],
    },
    {
      id: uuidv4(),
      company: "Innovate Inc.",
      title: "Frontend Developer",
      startDate: "2019",
      endDate: "2021",
      description: "Developed and maintained features for a large-scale e-commerce platform. Collaborated with UI/UX designers to implement pixel-perfect designs.",
      skillsUsed: ["Vue.js", "JavaScript", "SCSS"],
    },
  ],
  education: [
    {
        id: uuidv4(),
        school: "University of Technology",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        startDate: "2015",
        endDate: "2019",
        description: "Graduated with honors. Active member of the university's coding club and participated in several hackathons."
    }
  ],
  projects: [
    {
      id: uuidv4(),
      name: "E-commerce Platform",
      description: "A full-featured e-commerce website with product listings, shopping cart, and checkout functionality. Built with React and Node.js.",
      demoLink: "#",
      repoLink: "#",
      image: "https://picsum.photos/seed/project1/400/300",
      tags: ["React", "Node.js", "MongoDB"],
    },
    {
      id: uuidv4(),
      name: "Task Management App",
      description: "A Kanban-style task management application that helps users organize their workflow. Features drag-and-drop functionality.",
      demoLink: "#",
      repoLink: "#",
      image: "https://picsum.photos/seed/project2/400/300",
      tags: ["Vue.js", "Firebase", "Tailwind CSS"],
    },
  ],
  certifications: [
      {
          id: uuidv4(),
          name: "AWS Certified Cloud Practitioner",
          issuingOrganization: "Amazon Web Services",
          date: "2022",
          credentialUrl: "#",
          image: "https://picsum.photos/seed/aws-cert/200/200"
      }
  ],
  skills: {
    frontend: [
      { id: uuidv4(), name: "React", level: 95 },
      { id: uuidv4(), name: "Vue.js", level: 85 },
      { id: uuidv4(), name: "TypeScript", level: 90 },
    ],
    backend: [
      { id: uuidv4(), name: "Node.js", level: 80 },
      { id: uuidv4(), name: "Python", level: 70 },
      { id: uuidv4(), name: "SQL", level: 75 },
    ],
    tools: [
      { id: uuidv4(), name: "Docker", level: 70 },
      { id: uuidv4(), name: "Git", level: 95 },
      { id: uuidv4(), name: "AWS", level: 65 },
    ],
  },
  settings: {
    layout: "scroll",
    theme: "dark",
    primaryColor: "#3b82f6", // blue-500
    secondaryColor: "#10b981", // emerald-500
    fontFamily: "Roboto",
    customCss: `
/* Custom CSS can be added here */
    `,
    enableAnimations: true,
    sections: {
        about: true,
        experience: true,
        education: true,
        projects: true,
        skills: true,
        certifications: true,
        contact: true,
    }
  },
};