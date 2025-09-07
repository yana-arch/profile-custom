import React from 'react';
import { ProfileData } from '../../../types';
import Header from '../Header';
import Footer from '../Footer';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import ExperienceSection from '../sections/ExperienceSection';
import EducationSection from '../sections/EducationSection';
import ProjectsSection from '../sections/ProjectsSection';
import SkillsSection from '../sections/SkillsSection';
import CertificationsSection from '../sections/CertificationsSection';
import ContactSection from '../sections/ContactSection';

const ScrollView: React.FC<{ data: ProfileData }> = ({ data }) => {
  return (
    <>
      <Header data={data} />
      <section id="hero-container" className="h-[70vh] min-h-[500px]">
          <HeroSection data={data} />
      </section>
      <main>
        {data.settings.sections.about && <AboutSection data={data} />}
        {data.settings.sections.experience && <ExperienceSection data={data} />}
        {data.settings.sections.education && <EducationSection data={data} />}
        {data.settings.sections.projects && <ProjectsSection data={data} />}
        {data.settings.sections.skills && <SkillsSection data={data} />}
        {data.settings.sections.certifications && <CertificationsSection data={data} />}
        {data.settings.sections.contact && <ContactSection data={data} />}
      </main>
      <Footer data={data} />
    </>
  );
};

export default ScrollView;