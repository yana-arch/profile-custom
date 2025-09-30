import React from 'react';
import {
  SparklesIcon as HeroSparklesIcon,
  EyeIcon as HeroEyeIcon,
  CogIcon as HeroCogIcon,
  Bars3Icon as HeroBars3Icon,
  XMarkIcon as HeroXMarkIcon,
  ChevronLeftIcon as HeroChevronLeftIcon,
  ChevronRightIcon as HeroChevronRightIcon,
  UserIcon as HeroUserIcon,
  BriefcaseIcon as HeroBriefcaseIcon,
  CodeBracketIcon as HeroCodeBracketIcon,
  WrenchScrewdriverIcon as HeroWrenchScrewdriverIcon,
  AcademicCapIcon as HeroAcademicCapIcon,
  PaperAirplaneIcon as HeroPaperAirplaneIcon,
  HeartIcon as HeroHeartIcon,
  TrophyIcon as HeroTrophyIcon,
  GlobeAltIcon as HeroGlobeAltIcon,
  PaintBrushIcon as HeroPaintBrushIcon,
  TrashIcon as HeroTrashIcon,
  ChevronDownIcon as HeroChevronDownIcon,
  EyeSlashIcon as HeroEyeSlashIcon,
  ArrowsPointingOutIcon as HeroArrowsPointingOutIcon,
  ArrowsPointingInIcon as HeroArrowsPointingInIcon,
  DocumentArrowDownIcon as HeroDocumentArrowDownIcon,
  ViewfinderCircleIcon as HeroViewSimpleIcon,
  ArrowPathIcon as HeroSpinnerIcon,
  // Brand Icons
  LinkIcon as HeroLinkedInIcon,
  // Note: React, Vue, Node.js, Python, TypeScript, Docker, AWS icons would need custom implementations
  // or different icon names from Heroicons
} from '@heroicons/react/24/outline';

type IconProps = React.SVGProps<SVGSVGElement>;

// Re-export Heroicons with our naming convention
export const SparklesIcon: React.FC<IconProps> = (props) => <HeroSparklesIcon {...props} />;
export const ViewSimpleIcon: React.FC<IconProps> = (props) => <HeroViewSimpleIcon {...props} />;
export const EyeIcon: React.FC<IconProps> = (props) => <HeroEyeIcon {...props} />;

export const EyeSlashIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
  </svg>
);

export const CogIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5" />
  </svg>
);

export const ArrowsPointingOutIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m4.5 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
  </svg>
);

export const ArrowsPointingInIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9V4.5M15 9h4.5M15 9l5.25-5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25" />
  </svg>
);

export const DocumentArrowDownIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const Bars3Icon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export const XMarkIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const BriefcaseIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25h-10.5a2.25 2.25 0 01-2.25-2.25V14.15M16.5 18.75h-9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12.75v-2.25a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 10.5v2.25m19.5 0A2.25 2.25 0 0019.5 15h-15A2.25 2.25 0 002.25 12.75m19.5 0v-2.25A2.25 2.25 0 0019.5 8.25h-15A2.25 2.25 0 002.25 10.5v2.25m15-4.5a3 3 0 00-3-3h-6a3 3 0 00-3 3m12 0v-1.5a3 3 0 00-3-3h-6a3 3 0 00-3 3v1.5" />
  </svg>
);

export const CodeBracketIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V5.75A2.25 2.25 0 0018 3.5H6A2.25 2.25 0 003.75 5.75v12.25A2.25 2.25 0 006 20.25z" />
  </svg>
);

export const WrenchScrewdriverIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.636 4.636a2.121 2.121 0 01-3 3L3 17.25a2.121 2.121 0 013-3l4.636-4.636m-1.58-1.58l-1.42-1.42a2.121 2.121 0 013-3l1.42 1.42m-1.58 1.58L14.25 9" />
  </svg>
);

export const AcademicCapIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M12 14.75L6.16 11.328a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14.75z" />
  </svg>
);

export const PaperAirplaneIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

export const CertificateIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 100-13.5h9a9.75 9.75 0 000 13.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 100-13.5h9a9.75 9.75 0 000 13.5zM9 11.25l3 3m0 0l3-3m-3 3v-6m-1.5-1.5a.375.375 0 01.375-.375h2.25a.375.375 0 01.375.375v.375a.375.375 0 01-.375.375h-2.25a.375.375 0 01-.375-.375v-.375z" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export const TrophyIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 100-13.5h9a9.75 9.75 0 000 13.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h3m-3 3.75h3m-3 3.75h3M9 15v2.25a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5V15M6.75 12.75h10.5" />
  </svg>
);

export const GlobeAltIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9h18a9 9 0 01-9 9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9h18a9 9 0 01-9 9zm0 0v-4.5m0 4.5a9 9 0 009-9h-18a9 9 0 009 9z" />
  </svg>
);

export const SpinnerIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3a9 9 0 100 18 9 9 0 000-18z" opacity=".25"></path>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

export const PaintBrushIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09a2.09 2.09 0 00-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);


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

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);
