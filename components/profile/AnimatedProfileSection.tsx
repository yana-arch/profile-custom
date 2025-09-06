import React, { useState, useEffect, useRef } from 'react';

export const ProfileSection: React.FC<{ title: string; id: string; children: React.ReactNode }> = ({ title, id, children }) => (
  <section id={id} className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 w-full">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-text-primary mb-12 border-b-2 border-primary pb-2 inline-block">{title}</h2>
      {children}
    </div>
  </section>
);

const AnimatedProfileSection: React.FC<{ title: string; id: string; children: React.ReactNode }> = ({ title, id, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
    }, []);

    return (
        <div ref={sectionRef} className={`transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <ProfileSection title={title} id={id}>
                {children}
            </ProfileSection>
        </div>
    );
};

export default AnimatedProfileSection;
