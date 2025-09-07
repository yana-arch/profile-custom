import React, { useState, useEffect, useRef } from 'react';
import { AnimationSettings, Settings } from '../../types';

export const ProfileSection: React.FC<{ title: string; id: string; children: React.ReactNode }> = ({ title, id, children }) => (
  <section id={id} className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 w-full">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-12 border-b-2 border-primary pb-2 inline-block">{title}</h2>
      {children}
    </div>
  </section>
);

interface AnimatedProfileSectionProps {
    title: string;
    id: string;
    children: React.ReactNode;
    scrollAnimation: AnimationSettings['scrollAnimation'];
    viewMode: Settings['viewMode'];
}

const AnimatedProfileSection: React.FC<AnimatedProfileSectionProps> = ({ title, id, children, scrollAnimation, viewMode }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const isAnimated = viewMode === 'enhanced' && scrollAnimation !== 'none';

    useEffect(() => {
        if (!isAnimated) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [isAnimated]);

    if (!isAnimated) {
        return (
            <ProfileSection title={title} id={id}>
                {children}
            </ProfileSection>
        );
    }
    
    const animationClass = {
        'fadeIn': 'animate-fadeIn',
        'slideUp': 'animate-slideUp',
        'none': ''
    }[scrollAnimation] || '';


    return (
        <div ref={sectionRef} className={isVisible ? animationClass : 'opacity-0'}>
            <ProfileSection title={title} id={id}>
                {children}
            </ProfileSection>
        </div>
    );
};

export default AnimatedProfileSection;