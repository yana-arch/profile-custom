import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProfileData } from '../types';

export interface PDFExportOptions {
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  includePhotos?: boolean;
}

// Utility function to generate PDF from profile data
export const generateProfilePDF = async (
  profileData: ProfileData,
  options: PDFExportOptions = {}
): Promise<void> => {
  const {
    format = 'a4',
    orientation = 'portrait',
    quality = 1.0,
    includePhotos = true,
  } = options;

  try {
    // Create PDF document
    const doc = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format,
    });

    // PDF dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let yPosition = margin;

    // Set fonts and colors
    doc.setFont('helvetica');
    doc.setTextColor(51, 51, 51); // Dark gray

    // Helper function to add text with wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 7): number => {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return lines.length * lineHeight;
    };

    // Helper function to check if we need a new page
    const checkPageBreak = (neededHeight: number): number => {
      if (yPosition + neededHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        return margin;
      }
      return yPosition;
    };

    // Title
    const title = profileData.personalInfo?.name || 'My Profile';
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    yPosition += addWrappedText(title, margin, yPosition, contentWidth, 10);

    // Subtitle/Title
    if (profileData.personalInfo?.title) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      yPosition += addWrappedText(profileData.personalInfo.title, margin, yPosition + 5, contentWidth, 8) + 10;
    }

    // Contact Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = checkPageBreak(60);

    doc.text('Contact Information', margin, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');

    const contactInfo = [];
    if (profileData.personalInfo?.contact?.email) contactInfo.push(`Email: ${profileData.personalInfo.contact.email}`);
    if (profileData.personalInfo?.contact?.linkedin) contactInfo.push(`LinkedIn: ${profileData.personalInfo.contact.linkedin}`);
    if (profileData.personalInfo?.contact?.github) contactInfo.push(`GitHub: ${profileData.personalInfo.contact.github}`);
    if (profileData.personalInfo?.contact?.portfolio) contactInfo.push(`Portfolio: ${profileData.personalInfo.contact.portfolio}`);

    contactInfo.forEach(info => {
      yPosition = checkPageBreak(15);
      yPosition += addWrappedText(info, margin + 10, yPosition, contentWidth - 20, 7) + 2;
    });

    yPosition += 10;

    // About Section
    if (profileData.personalInfo?.bio) {
      doc.setFont('helvetica', 'bold');
      yPosition = checkPageBreak(20);
      doc.text('About', margin, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      yPosition = checkPageBreak(30);
      yPosition += addWrappedText(profileData.personalInfo.bio, margin + 10, yPosition, contentWidth - 20, 6) + 10;
    }

    // Experience Section
    if (profileData.experience && profileData.experience.length > 0) {
      doc.setFont('helvetica', 'bold');
      yPosition = checkPageBreak(20);
      doc.text('Experience', margin, yPosition);
      yPosition += 10;

      profileData.experience.forEach(exp => {
        yPosition = checkPageBreak(40);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.title, margin + 10, yPosition);
        doc.setFont('helvetica', 'italic');
        doc.text(exp.company, margin + 10, yPosition + 8);

        const duration = exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` :
                        exp.startDate ? `From ${exp.startDate}` : '';
        if (duration) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.text(duration, margin + 10, yPosition + 16);
          doc.setFontSize(12);
        }

        if (exp.description) {
          doc.setFont('helvetica', 'normal');
          yPosition += addWrappedText(exp.description, margin + 20, yPosition + 24, contentWidth - 30, 6) + 8;
        }

        yPosition += 35;
      });
    }

    // Education Section
    if (profileData.education && profileData.education.length > 0) {
      doc.setFont('helvetica', 'bold');
      yPosition = checkPageBreak(20);
      doc.text('Education', margin, yPosition);
      yPosition += 10;

      profileData.education.forEach(edu => {
        yPosition = checkPageBreak(25);
        doc.setFont('helvetica', 'bold');
        doc.text(edu.degree, margin + 10, yPosition);
        doc.setFont('helvetica', 'italic');
        doc.text(edu.school, margin + 10, yPosition + 8);

        const graduation = edu.endDate ? `Graduated: ${edu.endDate}` : '';
        if (graduation) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.text(graduation, margin + 10, yPosition + 16);
          doc.setFontSize(12);
        }

        yPosition += 25;
      });
    }

    // Skills Section
    if (profileData.skills && (profileData.skills.frontend.length > 0 || profileData.skills.backend.length > 0 || profileData.skills.tools.length > 0)) {
      doc.setFont('helvetica', 'bold');
      yPosition = checkPageBreak(20);
      doc.text('Skills', margin, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');

      const skillsCategories = [
        { name: 'Frontend', skills: profileData.skills.frontend },
        { name: 'Backend', skills: profileData.skills.backend },
        { name: 'Tools', skills: profileData.skills.tools }
      ];

      skillsCategories.forEach(category => {
        if (category.skills.length > 0) {
          yPosition = checkPageBreak(15);
          doc.setFont('helvetica', 'bold');
          doc.text(category.name, margin + 10, yPosition);
          doc.setFont('helvetica', 'normal');
          const skillsText = category.skills.map(skill => skill.name).join(', ');
          yPosition += addWrappedText(skillsText, margin + 20, yPosition + 8, contentWidth - 30, 6) + 5;
        }
      });

      yPosition += 5;
    }

    // Projects Section
    if (profileData.projects && profileData.projects.length > 0) {
      doc.setFont('helvetica', 'bold');
      yPosition = checkPageBreak(20);
      doc.text('Projects', margin, yPosition);
      yPosition += 10;

      profileData.projects.forEach(project => {
        yPosition = checkPageBreak(40);
        doc.setFont('helvetica', 'bold');
        doc.text(project.name, margin + 10, yPosition);

        if (project.tags && project.tags.length > 0) {
          doc.setFont('helvetica', 'italic');
          const tagsText = project.tags.join(', ');
          yPosition += addWrappedText(`Tags: ${tagsText}`, margin + 20, yPosition + 8, contentWidth - 30, 6) + 2;
        }

        if (project.description) {
          doc.setFont('helvetica', 'normal');
          yPosition += addWrappedText(project.description, margin + 20, yPosition + 16, contentWidth - 30, 6) + 5;
        }

        // Add links
        const links = [];
        if (project.repoLink) links.push(`Repository: ${project.repoLink}`);
        if (project.demoLink) links.push(`Demo: ${project.demoLink}`);

        if (links.length > 0) {
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 255); // Blue color for links
          links.forEach(link => {
            yPosition = checkPageBreak(10);
            yPosition += addWrappedText(link, margin + 20, yPosition, contentWidth - 30, 6);
          });
          doc.setTextColor(51, 51, 51); // Reset to dark gray
          doc.setFontSize(12);
        }

        yPosition += 15;
      });
    }

    // Footer with timestamp
    const timestamp = new Date().toLocaleString();
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on ${timestamp}`, margin, pageHeight - 10);
    doc.setTextColor(51, 51, 51);

    // Save the PDF
    const fileName = `${title.replace(/\s+/g, '_')}_CV.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Alternative approach using html2canvas for more complex styling
export const generateProfilePDFAdvanced = async (
  profileElement: HTMLElement,
  fileName: string = 'profile.pdf'
): Promise<void> => {
  try {
    const canvas = await html2canvas(profileElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating advanced PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};
