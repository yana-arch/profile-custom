import React, { useState, useEffect, useRef } from 'react';
import { ProfileData } from '../../../types';
import { ChevronLeftIcon, ChevronRightIcon, DocumentArrowDownIcon, ChevronDownIcon } from '../../icons/Icons';
import { generateProfilePDF } from '../../../utils/pdfExport';
import { generateProfilePPT, generateProfilePPTFromData, captureSlidesForPPT } from '../../../utils/pptExport';
import Header from '../Header';
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

const SlideView: React.FC<{ data: ProfileData }> = ({ data }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  const contentAvailable = {
    hero: true,
    about: true,
    experience: data.experience.length > 0,
    education: data.education.length > 0,
    projects: data.projects.length > 0,
    skills: data.skills.frontend.length > 0 || data.skills.backend.length > 0 || data.skills.tools.length > 0,
    certifications: data.certifications.length > 0,
    awards: data.awards.length > 0,
    hobbies: data.hobbies.length > 0,
    contact: true,
  };

  const slides = [
    { id: 'hero', component: <HeroSection data={data} />, visible: true },
    { id: 'about', component: <AboutSection data={data} />, visible: data.settings.sections.about },
    { id: 'experience', component: <ExperienceSection data={data} />, visible: data.settings.sections.experience },
    { id: 'education', component: <EducationSection data={data} />, visible: data.settings.sections.education },
    { id: 'projects', component: <ProjectsSection data={data} />, visible: data.settings.sections.projects },
    { id: 'skills', component: <SkillsSection data={data} />, visible: data.settings.sections.skills },
    {
      id: 'certifications',
      component: <CertificationsSection data={data} />,
      visible: data.settings.sections.certifications,
    },
    { id: 'awards', component: <AwardsSection data={data} />, visible: data.settings.sections.awards },
    { id: 'hobbies', component: <HobbiesSection data={data} />, visible: data.settings.sections.hobbies },
    { id: 'contact', component: <ContactSection data={data} />, visible: data.settings.sections.contact },
  ].filter((slide) => slide.visible && contentAvailable[slide.id as keyof typeof contentAvailable]);

  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const slideElement = scrollContainerRef.current.children[index] as HTMLElement;
      slideElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setCurrentSlide(index);
    }
  };

  const handleNext = () => scrollToSlide(Math.min(currentSlide + 1, slides.length - 1));
  const handlePrev = () => scrollToSlide(Math.max(currentSlide - 1, 0));

  useEffect(() => {
    if (currentSlide >= slides.length && slides.length > 0) {
      setCurrentSlide(slides.length - 1);
    }
  }, [slides, currentSlide]);

  const handleDownloadPDF = async () => {
    setIsExportDropdownOpen(false);
    try {
      await generateProfilePDF(data);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownloadPPT = async () => {
    setIsExportDropdownOpen(false);
    try {
      // First try to capture the current slides
      const slideElements = await captureSlidesForPPT(scrollContainerRef.current!, slides);
      await generateProfilePPT(slideElements, undefined, { format: 'widescreen' });
    } catch (error) {
      console.error('PPT generation failed:', error);
      try {
        // Fallback to data-based generation
        await generateProfilePPTFromData(data, { format: 'widescreen' });
      } catch (fallbackError) {
        console.error('Fallback PPT generation failed:', fallbackError);
        alert('Failed to generate PPT. Please try again.');
      }
    }
  };

  return (
    <div className="h-screen w-screen relative">
      <Header data={data} viewLayout="slide" slideContainerRef={scrollContainerRef} slides={slides} />
      <div ref={scrollContainerRef} className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        {slides.map((slide) => (
          <div key={slide.id} className="h-full w-full snap-center flex items-center justify-center flex-shrink-0">
            {slide.component}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
            ></button>
          ))}
        </div>
      )}

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
            {/* Backdrop to close dropdown */}
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
    </div>
  );
};

export default SlideView;
