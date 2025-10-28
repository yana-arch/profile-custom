import React, { useState } from 'react';
import { ProfileData } from '../../../types';
import { generateProfilePDF } from '../../../utils/pdfExport';
import { generateProfilePPTFromData } from '../../../utils/pptExport';
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
import { DocumentArrowDownIcon, ChevronDownIcon } from '../../../components/icons/Icons';

const ScrollView: React.FC<{ data: ProfileData }> = ({ data }) => {
  const hasSkills = data.skills.frontend.length > 0 || data.skills.backend.length > 0 || data.skills.tools.length > 0;
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  const handleDownloadPDF = async () => {
    setIsExportDropdownOpen(false); // Close dropdown first
    try {
      await generateProfilePDF(data);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownloadPPT = async () => {
    setIsExportDropdownOpen(false); // Close dropdown first
    try {
      await generateProfilePPTFromData(data);
    } catch (error) {
      console.error('PPT generation failed:', error);
      alert('Failed to generate PPT. Please try again.');
    }
  };

  return (
    <>
      <Header data={data} viewLayout="scroll" />
      <section id="hero-container" className="h-[70vh] min-h-[500px]">
        <HeroSection data={data} />
      </section>

      {/* Export Dropdown - Fixed Position */}
      <div className="fixed bottom-52 left-4 z-50 print-hidden">
        <button
          onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-colors flex items-center"
          title="Export options"
        >
          <DocumentArrowDownIcon className="h-6 w-6" />
          <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isExportDropdownOpen && (
          <>
            {/* Backdrop to close dropdown - using a button for proper accessibility */}
            <button
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsExportDropdownOpen(false)}
              aria-label="Close export menu"
            />

            {/* Dropdown menu */}
            <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 min-w-48 z-50">
              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-100"
              >
                <div className="w-4 h-4 bg-green-600 rounded mr-3 flex items-center justify-center">
                  <DocumentArrowDownIcon className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">Download as PDF</span>
              </button>

              <button
                onClick={handleDownloadPPT}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700"
              >
                <div className="w-4 h-4 bg-blue-600 rounded mr-3 flex items-center justify-center">
                  <DocumentArrowDownIcon className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">Export as PPT</span>
              </button>
            </div>
          </>
        )}
      </div>

      <main>
        {data.settings.sections.about && <AboutSection data={data} />}
        {data.settings.sections.experience && data.experience.length > 0 && <ExperienceSection data={data} />}
        {data.settings.sections.education && data.education.length > 0 && <EducationSection data={data} />}
        {data.settings.sections.projects && data.projects.length > 0 && <ProjectsSection data={data} />}
        {data.settings.sections.skills && hasSkills && <SkillsSection data={data} />}
        {data.settings.sections.certifications && data.certifications.length > 0 && (
          <CertificationsSection data={data} />
        )}
        {data.settings.sections.awards && data.awards.length > 0 && <AwardsSection data={data} />}
        {data.settings.sections.hobbies && data.hobbies.length > 0 && <HobbiesSection data={data} />}
        {data.settings.sections.contact && <ContactSection data={data} />}
      </main>
      <Footer data={data} />
    </>
  );
};

export default ScrollView;
