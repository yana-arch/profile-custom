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
  const animated = data.settings.enableAnimations;
  return (
    <>
      <Header data={data} />
      <section className="h-[70vh] min-h-[500px]">
          <HeroSection data={data} />
      </section>
      <main>
        {data.settings.sections.about && <AboutSection data={data} animated={animated} />}
        {data.settings.sections.experience && <ExperienceSection data={data} animated={animated} />}
        {data.settings.sections.education && <EducationSection data={data} animated={animated} />}
        {data.settings.sections.projects && <ProjectsSection data={data} animated={animated} />}
        {data.settings.sections.skills && <SkillsSection data={data} animated={animated} />}
        {data.settings.sections.certifications && <CertificationsSection data={data} animated={animated} />}
        {data.settings.sections.contact && <ContactSection data={data} animated={animated} />}
      </main>
      <Footer data={data} />
    </>
  );
};

export default ScrollView;