import React, { useState, useEffect, useRef } from 'react';
import { ProfileData } from '../../../types';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons/Icons';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import ExperienceSection from '../sections/ExperienceSection';
import EducationSection from '../sections/EducationSection';
import ProjectsSection from '../sections/ProjectsSection';
import SkillsSection from '../sections/SkillsSection';
import CertificationsSection from '../sections/CertificationsSection';
import ContactSection from '../sections/ContactSection';

const SlideView: React.FC<{ data: ProfileData }> = ({ data }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const animated = data.settings.enableAnimations;

    const slides = [
        { id: 'hero', component: <HeroSection data={data} />, visible: true },
        { id: 'about', component: <AboutSection data={data} animated={animated} />, visible: data.settings.sections.about },
        { id: 'experience', component: <ExperienceSection data={data} animated={animated} />, visible: data.settings.sections.experience },
        { id: 'education', component: <EducationSection data={data} animated={animated} />, visible: data.settings.sections.education },
        { id: 'projects', component: <ProjectsSection data={data} animated={animated} />, visible: data.settings.sections.projects },
        { id: 'skills', component: <SkillsSection data={data} animated={animated} />, visible: data.settings.sections.skills },
        { id: 'certifications', component: <CertificationsSection data={data} animated={animated} />, visible: data.settings.sections.certifications },
        { id: 'contact', component: <ContactSection data={data} animated={animated} />, visible: data.settings.sections.contact },
    ].filter(slide => slide.visible);

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
        if(currentSlide >= slides.length && slides.length > 0) {
            setCurrentSlide(slides.length - 1);
        }
    }, [slides, currentSlide]);

    return (
        <div className="h-screen w-screen relative">
            <div ref={scrollContainerRef} className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
                {slides.map(slide => (
                    <div key={slide.id} className="h-full w-full snap-center flex items-center justify-center flex-shrink-0">
                        {slide.component}
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button onClick={handlePrev} disabled={currentSlide === 0} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10">
                <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button onClick={handleNext} disabled={currentSlide === slides.length - 1} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10">
                <ChevronRightIcon className="h-6 w-6" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {slides.map((_, index) => (
                    <button key={index} onClick={() => scrollToSlide(index)} className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}></button>
                ))}
            </div>
        </div>
    );
};

export default SlideView;