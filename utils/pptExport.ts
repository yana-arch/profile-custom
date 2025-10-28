import PptxGenJS from 'pptxgenjs';
import html2canvas from 'html2canvas';
import { ProfileData } from '../types';

export interface PPTExportOptions {
  format?: 'widescreen' | 'standard';
  quality?: number;
  includePhotos?: boolean;
}

export interface SlideElement {
  element: HTMLElement;
  title?: string;
  shouldSplit?: boolean;
}

// Utility function to generate PPT from profile data in slide view
export const generateProfilePPT = async (
  slideElements: SlideElement[],
  fileName: string = 'profile_slides.pptx',
  options: PPTExportOptions = {}
): Promise<void> => {
  const {
    format = 'widescreen',
    quality = 1.0,
    includePhotos = true,
  } = options;

  try {
    // Create PPT presentation
    const pres = new PptxGenJS();

    // Set slide layout based on format (16:9 for widescreen, 4:3 for standard)
    if (format === 'widescreen') {
      pres.layout = 'LAYOUT_WIDE';
    } else {
      pres.layout = 'LAYOUT_4x3';
    }

    pres.author = 'Profile Custom';
    pres.company = 'Profile Custom';
    pres.subject = 'Profile Slides';
    pres.title = 'Profile Slides Export';

    // Slide dimensions
    const slideWidth = format === 'widescreen' ? 10 : 8;
    const slideHeight = 5.625; // 16:9 ratio for widescreen, proportional for standard

    // Process each slide element
    for (let i = 0; i < slideElements.length; i++) {
      const slideElement = slideElements[i];

      try {
        // Capture the rendered element as image
        const canvas = await html2canvas(slideElement.element, {
          scale: quality,
          useCORS: true,
          allowTaint: false,
          backgroundColor: null, // Keep original colors
          logging: false,
          width: slideElement.element.offsetWidth,
          height: slideElement.element.offsetHeight,
          scrollX: 0,
          scrollY: 0,
        });

        const imgData = canvas.toDataURL('image/png');

        // Create a new slide
        const slide = pres.addSlide();

        // Add title if present
        /* if (slideElement.title) {
          slide.addText(slideElement.title, {
            x: 0.5,
            y: 0.3,
            w: slideWidth - 1,
            h: 0.5,
            fontSize: 24,
            bold: true,
            color: '363636',
            align: 'center',
            valign: 'middle',
          });
        } */

        // Add the captured image to the slide (centered, maintaining aspect ratio)
        slide.addImage({
          data: imgData,
          x: 0,
          y: 0,
          w: slideWidth,
          h: slideHeight,
          sizing: { type: 'contain', w: slideWidth, h: slideHeight }
        });

        // Add slide number if more than one slide
        if (slideElements.length > 1) {
          slide.addText(`${i + 1} / ${slideElements.length}`, {
            x: slideWidth - 1.5,
            y: slideHeight - 0.3,
            w: 1.2,
            h: 0.3,
            fontSize: 12,
            color: '666666',
            align: 'right',
          });
        }
      } catch (slideError) {
        console.warn(`Error capturing slide ${i + 1}:`, slideError);
        // Add an error slide
        const slide = pres.addSlide();
        slide.addText(`Error loading slide ${i + 1}`, {
          x: 2,
          y: 2,
          w: 6,
          h: 3,
          fontSize: 18,
          color: 'CC0000',
          align: 'center',
          valign: 'middle',
        });
      }
    }

    // Generate and download the PPT
    await pres.writeFile({ fileName });

  } catch (error) {
    console.error('Error generating PPT:', error);
    throw new Error('Failed to generate PPT. Please try again.');
  }
};

// Helper function to capture slide elements from SlideView component
export const captureSlidesForPPT = async (
  slidesContainer: HTMLElement,
  slides: Array<{ id: string; component: any }>
): Promise<SlideElement[]> => {
  const slideElements: SlideElement[] = [];

  // Find all slide containers within the scroll container
  const slideContainers = slidesContainer.querySelectorAll('[class*="snap-center"]');

  for (let i = 0; i < slideContainers.length && i < slides.length; i++) {
    const container = slideContainers[i] as HTMLElement;

    if (container) {
      // Ensure the container is temporarily visible for capture
      const originalStyles = {
        display: container.style.display,
        visibility: container.style.visibility,
        opacity: container.style.opacity,
        position: container.style.position,
        zIndex: container.style.zIndex,
        transform: container.style.transform,
      };

      // Make container visible for capture
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.opacity = '1';
      container.style.position = 'relative';
      container.style.zIndex = '9999';
      container.style.transform = 'translateY(0)';

      // Find the actual content element within the slide
      const contentElement = container.querySelector('div[class*="flex items-center justify-center"]') as HTMLElement ||
                            container.querySelector('section') as HTMLElement ||
                            container;

      if (contentElement) {
        // Generate title from slide ID
        const slide = slides[i];
        const title = slide ? slide.id.charAt(0).toUpperCase() + slide.id.slice(1) : `Slide ${i + 1}`;

        slideElements.push({
          element: contentElement,
          title: title,
          shouldSplit: false,
        });
      }

      // Restore original styles
      Object.assign(container.style, originalStyles);
    }
  }

  return slideElements;
};

// Alternative approach: generate PPT from profile data directly (fallback if slide capture fails)
export const generateProfilePPTFromData = async (
  profileData: ProfileData,
  options: PPTExportOptions = {}
): Promise<void> => {
  const {
    format = 'widescreen',
  } = options;

  try {
    // Create PPT presentation
    const pres = new PptxGenJS();

    if (format === 'widescreen') {
      pres.layout = 'LAYOUT_WIDE';
    } else {
      pres.layout = 'LAYOUT_4x3';
    }

    pres.author = 'Profile Custom';
    pres.company = 'Profile Custom';
    pres.subject = 'Profile Data Export';
    pres.title = profileData.personalInfo?.name || 'Profile Export';

    // Title slide
    const titleSlide = pres.addSlide();
    titleSlide.addText(profileData.personalInfo?.name || 'My Profile', {
      x: 1,
      y: 1.5,
      w: 8,
      h: 1,
      fontSize: 44,
      bold: true,
      color: '363636',
      align: 'center',
    });

    if (profileData.personalInfo?.title) {
      titleSlide.addText(profileData.personalInfo.title, {
        x: 1,
        y: 2.8,
        w: 8,
        h: 0.5,
        fontSize: 24,
        color: '666666',
        align: 'center',
      });
    }

    // Contact slide
    if (profileData.personalInfo?.contact) {
      const contactSlide = pres.addSlide();
      contactSlide.addText('Contact Information', {
        x: 1,
        y: 0.5,
        w: 8,
        h: 0.5,
        fontSize: 32,
        bold: true,
        color: '363636',
      });

      const contactLines = [];
      if (profileData.personalInfo.contact.email) contactLines.push(`Email: ${profileData.personalInfo.contact.email}`);
      if (profileData.personalInfo.contact.linkedin) contactLines.push(`LinkedIn: ${profileData.personalInfo.contact.linkedin}`);
      if (profileData.personalInfo.contact.github) contactLines.push(`GitHub: ${profileData.personalInfo.contact.github}`);
      if (profileData.personalInfo.contact.portfolio) contactLines.push(`Portfolio: ${profileData.personalInfo.contact.portfolio}`);

      const contactText = contactLines.join('\n');
      if (contactText) {
        contactSlide.addText(contactText, {
          x: 1,
          y: 1.2,
          w: 8,
          h: 2,
          fontSize: 18,
          color: '363636',
          lineSpacing: 24,
        });
      }
    }

    // About slide
    if (profileData.personalInfo?.bio) {
      const aboutSlide = pres.addSlide();
      aboutSlide.addText('About', {
        x: 1,
        y: 0.5,
        w: 8,
        h: 0.5,
        fontSize: 32,
        bold: true,
        color: '363636',
      });

      aboutSlide.addText(profileData.personalInfo.bio, {
        x: 1,
        y: 1.2,
        w: 8,
        h: 3,
        fontSize: 16,
        color: '363636',
        align: 'justify',
      });
    }

    // Experience slides
    if (profileData.experience && profileData.experience.length > 0) {
      for (let i = 0; i < profileData.experience.length; i++) {
        const exp = profileData.experience[i];
        const expSlide = pres.addSlide();

        expSlide.addText('Experience', {
          x: 1,
          y: 0.2,
          w: 8,
          h: 0.4,
          fontSize: 24,
          bold: true,
          color: '363636',
        });

        expSlide.addText(exp.title, {
          x: 1,
          y: 0.8,
          w: 8,
          h: 0.3,
          fontSize: 18,
          bold: true,
          color: '0066CC',
        });

        expSlide.addText(exp.company, {
          x: 1,
          y: 1.2,
          w: 8,
          h: 0.3,
          fontSize: 16,
          color: '666666',
        });

        const duration = exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` :
                        exp.startDate ? `From ${exp.startDate}` : '';
        if (duration) {
          expSlide.addText(duration, {
            x: 1,
            y: 1.5,
            w: 8,
            h: 0.3,
            fontSize: 14,
            color: '999999',
          });
        }

        if (exp.description) {
          expSlide.addText(exp.description, {
            x: 1,
            y: 2,
            w: 8,
            h: 2.5,
            fontSize: 14,
            color: '363636',
          });
        }
      }
    }

    // Education slide
    if (profileData.education && profileData.education.length > 0) {
      const educationSlide = pres.addSlide();
      educationSlide.addText('Education', {
        x: 1,
        y: 0.5,
        w: 8,
        h: 0.5,
        fontSize: 32,
        bold: true,
        color: '363636',
      });

      let yPos = 1.2;
      profileData.education.forEach(edu => {
        educationSlide.addText(`${edu.degree} - ${edu.school}`, {
          x: 1,
          y: yPos,
          w: 8,
          h: 0.3,
          fontSize: 16,
          color: '363636',
        });
        yPos += 0.4;

        if (edu.endDate) {
          educationSlide.addText(`Graduated: ${edu.endDate}`, {
            x: 1,
            y: yPos,
            w: 8,
            h: 0.3,
            fontSize: 14,
            color: '999999',
          });
          yPos += 0.4;
        }
      });
    }

    // Skills slide
    if (profileData.skills && (profileData.skills.frontend.length > 0 || profileData.skills.backend.length > 0 || profileData.skills.tools.length > 0)) {
      const skillsSlide = pres.addSlide();
      skillsSlide.addText('Skills', {
        x: 1,
        y: 0.5,
        w: 8,
        h: 0.5,
        fontSize: 32,
        bold: true,
        color: '363636',
      });

      let yPos = 1.2;
      const skillsCategories = [
        { name: 'Frontend', skills: profileData.skills.frontend },
        { name: 'Backend', skills: profileData.skills.backend },
        { name: 'Tools', skills: profileData.skills.tools }
      ];

      skillsCategories.forEach(category => {
        if (category.skills.length > 0) {
          skillsSlide.addText(category.name, {
            x: 1,
            y: yPos,
            w: 8,
            h: 0.3,
            fontSize: 18,
            bold: true,
            color: '0066CC',
          });
          yPos += 0.4;

          const skillsText = category.skills.map(skill => skill.name).join(', ');
          skillsSlide.addText(skillsText, {
            x: 1,
            y: yPos,
            w: 8,
            h: 0.6,
            fontSize: 14,
            color: '363636',
          });
          yPos += 0.8;
        }
      });
    }

    // Projects slides
    if (profileData.projects && profileData.projects.length > 0) {
      for (let i = 0; i < profileData.projects.length; i++) {
        const project = profileData.projects[i];
        const projectSlide = pres.addSlide();

        projectSlide.addText('Project', {
          x: 1,
          y: 0.2,
          w: 8,
          h: 0.4,
          fontSize: 24,
          bold: true,
          color: '363636',
        });

        projectSlide.addText(project.name, {
          x: 1,
          y: 0.8,
          w: 8,
          h: 0.3,
          fontSize: 18,
          bold: true,
          color: '0066CC',
        });

        if (project.tags && project.tags.length > 0) {
          projectSlide.addText(`Tags: ${project.tags.join(', ')}`, {
            x: 1,
            y: 1.2,
            w: 8,
            h: 0.3,
            fontSize: 14,
            color: '666666',
          });
        }

        if (project.description) {
          projectSlide.addText(project.description, {
            x: 1,
            y: 1.6,
            w: 8,
            h: 1.5,
            fontSize: 14,
            color: '363636',
          });
        }

        // Add links
        const links = [];
        if (project.repoLink) links.push(`Repository: ${project.repoLink}`);
        if (project.demoLink) links.push(`Demo: ${project.demoLink}`);

        if (links.length > 0) {
          projectSlide.addText(links.join('\n'), {
            x: 1,
            y: 3.2,
            w: 8,
            h: 1,
            fontSize: 12,
            color: '0066CC',
          });
        }
      }
    }

    // Generate filename
    const fileName = `${profileData.personalInfo?.name?.replace(/\s+/g, '_') || 'profile'}_presentation.pptx`;

    // Generate and download the PPT
    await pres.writeFile({ fileName });

  } catch (error) {
    console.error('Error generating PPT from data:', error);
    throw new Error('Failed to generate PPT. Please try again.');
  }
};
