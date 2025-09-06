import React from 'react';
import { ProfileData } from '../../../types';

const HeroSection: React.FC<{ data: ProfileData }> = ({ data }) => (
  <section className="relative h-full w-full flex items-center justify-center text-white text-center p-4">
    <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
    <img src={data.personalInfo.heroImage} alt="Hero background" className="absolute inset-0 w-full h-full object-cover z-[-1]" />
    <div className="z-10">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">{data.personalInfo.name}</h1>
      <p className="text-xl md:text-2xl font-light text-gray-200 mb-8">{data.personalInfo.title}</p>
      <div className="space-x-4">
        <a href="#contact" className="bg-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition duration-300">Contact Me</a>
        <a href="#projects" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-lg transition duration-300">My Work</a>
      </div>
    </div>
  </section>
);

export default HeroSection;
