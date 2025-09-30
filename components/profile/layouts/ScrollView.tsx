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
import HobbiesSection from '../sections/HobbiesSection';
import AwardsSection from '../sections/AwardsSection';
import ContactSection from '../sections/ContactSection';

const ScrollView: React.FC<{ data: ProfileData }> = ({ data }) => {
  const hasSkills = data.skills.frontend.length > 0 || data.skills.backend.length > 0 || data.skills.tools.length > 0;
  
  return (
    <>
      <Header data={data} />
      <section id="hero-container" className="h-[70vh] min-h-[500px]">
          <HeroSection data={data} />
      </section>
      <main>
        {data.settings.sections.about && <AboutSection data={data} />}
        {data.settings.sections.experience && data.experience.length > 0 && <ExperienceSection data={data} />}
        {data.settings.sections.education && data.education.length > 0 && <EducationSection data={data} />}
        {data.settings.sections.projects && data.projects.length > 0 && <ProjectsSection data={data} />}
        {data.settings.sections.skills && hasSkills && <SkillsSection data={data} />}
        {data.settings.sections.certifications && data.certifications.length > 0 && <CertificationsSection data={data} />}
        {data.settings.sections.awards && data.awards.length > 0 && <AwardsSection data={data} />}
        {data.settings.sections.hobbies && data.hobbies.length > 0 && <HobbiesSection data={data} />}
        {data.settings.sections.contact && <ContactSection data={data} />}
      </main>
      <Footer data={data} />
    </>
  );
};

export default ScrollView;