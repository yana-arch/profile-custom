import React from 'react';
import {
  // Core UI Icons
  SparklesIcon,
  EyeIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  UserIcon,
  BriefcaseIcon,
  CodeBracketIcon,
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  PaperAirplaneIcon,
  HeartIcon,
  TrophyIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  TrashIcon,
  EyeSlashIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  DocumentArrowDownIcon,
  ViewfinderCircleIcon,
  ArrowPathIcon,
  // Additional icons
  ClipboardDocumentCheckIcon,
  // Brand Icons
  LinkIcon,
} from '@heroicons/react/24/outline';

type IconProps = React.SVGProps<SVGSVGElement>;

// Export Heroicons directly for use in components
export {
  SparklesIcon,
  EyeIcon,
  Cog6ToothIcon as CogIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  UserIcon,
  BriefcaseIcon,
  CodeBracketIcon,
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  PaperAirplaneIcon,
  HeartIcon,
  TrophyIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  TrashIcon,
  EyeSlashIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  DocumentArrowDownIcon,
  ViewfinderCircleIcon,
  ArrowPathIcon,
  ClipboardDocumentCheckIcon as CertificateIcon,
  ViewfinderCircleIcon as ViewSimpleIcon,
  ArrowPathIcon as SpinnerIcon,
  LinkIcon,
};


// Brand Icons
export const LinkedInIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);
export const GitHubIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
export const ReactIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor" {...props}>
    <circle r="2.05" fill="#61dafb" />
    <g stroke="#61dafb" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);
export const VueIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z" />
  </svg>
);
export const NodeJsIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.72,16.94A2.39,2.39,0,0,1,9.8,18.3a2.33,2.33,0,0,1-2.19-1.3,2.6,2.6,0,0,1-.25-1.21,3.48,3.48,0,0,1,.28-1.58,3.1,3.1,0,0,1,.84-1.2,4.4,4.4,0,0,1,1.35-.74,12,12,0,0,1,2-.45l.65-.12a.66.66,0,0,0,.42-.25.59.59,0,0,0,.17-.43,1,1,0,0,0-.31-.79,1.25,1.25,0,0,0-.9-.31,1.83,1.83,0,0,0-1.2.45,2.06,2.06,0,0,0-.7,1.22l-1.63-.4A3.6,3.6,0,0,1,8,9.52a3.18,3.18,0,0,1,2.08-1,3.1,3.1,0,0,1,2.51.2,2.3,2.3,0,0,1,1,1,2,2,0,0,1,.32,1.2,2.37,2.37,0,0,1-.4,1.3,4.52,4.52,0,0,1-1.09,1.08,7.14,7.14,0,0,1-1.48.65l-.65.23a.79.79,0,0,0-.42.27.63.63,0,0,0-.16.45,1.08,1.08,0,0,0,.25.75,1.09,1.09,0,0,0,.79.33,2.44,2.44,0,0,0,2.16-1.25ZM22.42,12A10.42,10.42,0,1,1,12,1.58,10.42,10.42,0,0,1,22.42,12ZM19,10.65a2.53,2.53,0,0,0-2-2.31,2.2,2.2,0,0,0-2.3,1.2,5,5,0,0,0-.37,2.16v.38a4.8,4.8,0,0,0,.37,2.1,2.22,2.22,0,0,0,2.3,1.2,2.5,2.5,0,0,0,2-2.31,8.32,8.32,0,0,0-.19-2.36A8.32,8.32,0,0,0,19,10.65Z" />
  </svg>
);
export const PythonIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.001 2.012c-3.793 0-6.875 3.081-6.875 6.875v2.25h4.625c2.559 0 4.625-2.067 4.625-4.625s-2.066-4.5-4.625-4.5zm0 17.976c3.792 0 6.875-3.082 6.875-6.875v-2.25h-4.625c-2.558 0-4.625 2.066-4.625 4.625s2.067 4.5 4.625 4.5z" />
  </svg>
);
export const TypeScriptIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M1.5 24h21V0H1.5v24zM12 18.293l-4.72-4.72.707-.707L12 16.879l4.013-4.013.707.707L12 18.293z" fill="#fff" />
    <path d="M10.887 5.093h2.23l.115 1.583h.11c.42-.796 1.4-1.68 2.92-1.68.21 0 .42.02.63.05v2.24c-.16-.02-.32-.04-.48-.04-.54 0-1.04.16-1.46.46-.42.3-.74.72-1.02 1.28-.27.56-.42 1.2-.5 1.9v5.27h-2.53V5.09z" />
  </svg>
);
export const DockerIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.14 8.24l-1.37-3.9A1.2 1.2 0 0019.66 3.5H4.34a1.2 1.2 0 00-1.11.84L1.86 8.24a1.2 1.2 0 00.22 1.21L5.5 13 .24 16.55a1.2 1.2 0 000 1.41l2.45 2.45a1.2 1.2 0 001.7 0l4.3-4.3h5.42l4.3 4.3a1.2 1.2 0 001.7 0l2.45-2.45a1.2 1.2 0 000-1.41L18.5 13l3.42-3.55a1.2 1.2 0 00.22-1.21zM9.5 8.5h-2v-2h2zm3 0h-2v-2h2zm3 0h-2v-2h2zm3 0h-2v-2h2z" />
  </svg>
);
export const AwsIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.42 12.28a.75.75 0 00-1.06-1.06l-4.25 4.25a.75.75 0 101.06 1.06l4.25-4.25zm-2.17-4.25a.75.75 0 00-1.06 1.06l4.25 4.25a.75.75 0 001.06-1.06l-4.25-4.25zM12 2a10 10 0 100 20 10 10 0 000-20z" />
  </svg>
);
