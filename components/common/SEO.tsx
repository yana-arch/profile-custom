import React, { useEffect } from 'react';
import { ProfileData } from '../../types';

interface SEOProps {
  data: ProfileData;
}

const SEO: React.FC<SEOProps> = ({ data }) => {
  const { personalInfo } = data;

  useEffect(() => {
    // Update document title
    document.title = `${personalInfo.name} - ${personalInfo.title}`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', personalInfo.bio || `${personalInfo.name} - ${personalInfo.title}`);
    }

    // Add JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": personalInfo.name,
      "jobTitle": personalInfo.title,
      "description": personalInfo.bio,
      "image": personalInfo.avatar,
      "sameAs": [
        personalInfo.contact.linkedin,
        personalInfo.contact.github,
        personalInfo.contact.portfolio
      ].filter(Boolean),
      "contactPoint": {
        "@type": "ContactPoint",
        "email": personalInfo.contact.email,
        "contactType": "professional"
      },
      "hasOccupation": {
        "@type": "Occupation",
        "name": personalInfo.title,
        "skills": data.skills.frontend.concat(data.skills.backend, data.skills.tools).map(skill => skill.name)
      }
    };

    // Remove existing structured data
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Add Open Graph meta tags
    const addMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    addMetaTag('og:title', `${personalInfo.name} - ${personalInfo.title}`);
    addMetaTag('og:description', personalInfo.bio || `${personalInfo.name} - ${personalInfo.title}`);
    addMetaTag('og:image', personalInfo.avatar);
    addMetaTag('og:url', window.location.href);
    addMetaTag('og:type', 'profile');

    // Add Twitter Card meta tags
    const addTwitterTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    addTwitterTag('twitter:card', 'summary_large_image');
    addTwitterTag('twitter:title', `${personalInfo.name} - ${personalInfo.title}`);
    addTwitterTag('twitter:description', personalInfo.bio || `${personalInfo.name} - ${personalInfo.title}`);
    addTwitterTag('twitter:image', personalInfo.avatar);

  }, [personalInfo, data.skills]);

  return null; // This component doesn't render anything
};

export default SEO;
