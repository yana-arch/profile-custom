import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ProfileData } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import { isValidUrl, isValidEmail } from '../../../utils/validation';
import { SparklesIcon, SpinnerIcon } from '../../icons/Icons';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

const PersonalInfoSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isBioLoading, setIsBioLoading] = useState(false);

  const validateField = (name: string, value: string): string => {
      const requiredFields = ['name', 'title', 'bio', 'email'];
      
      if (requiredFields.includes(name) && !value.trim()) {
          return 'This field is required.';
      } 
      if ((name.includes('Url') || name.includes('avatar') || name.includes('heroImage') || name === 'linkedin' || name === 'github' || name === 'portfolio') && value && !isValidUrl(value)) {
          return 'Please enter a valid URL.';
      }
      if (name === 'email' && value && !isValidEmail(value)) {
          return 'Please enter a valid email address.';
      }
      return '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, parent: 'personalInfo' | 'contact') => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: ''}));
    }

    if (parent === 'personalInfo') {
      setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value }}));
    } else {
      setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, contact: { ...prev.personalInfo.contact, [name]: value }}}));
    }
  };

  const generateBio = async () => {
    if (!data.personalInfo.title) {
        alert('Please enter your title first to generate a bio.');
        return;
    }
    setIsBioLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const prompt = `Write a professional and engaging bio for a "${data.personalInfo.title}". The bio should be approximately 2-3 sentences long.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const generatedBio = response.text;
        if (!generatedBio) {
          throw new Error("No text returned from API for bio generation.");
        }
        setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, bio: generatedBio.trim() } }));
    } catch (error) {
        console.error("Error generating bio:", error);
        alert("Sorry, there was an error generating the bio. Please try again.");
    } finally {
        setIsBioLoading(false);
    }
  };

  return (
    <AdminSection title="Personal Info">
      <InputField label="Full Name" name="name" value={data.personalInfo.name} onChange={e => handleChange(e, 'personalInfo')} onBlur={handleBlur} placeholder="e.g., Jane Doe" error={errors.name} />
      <InputField label="Title" name="title" value={data.personalInfo.title} onChange={e => handleChange(e, 'personalInfo')} onBlur={handleBlur} placeholder="e.g., Senior Software Engineer" error={errors.title}/>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="bio" className="block text-sm font-medium text-text-secondary">Bio</label>
          <button
            type="button"
            onClick={generateBio}
            disabled={isBioLoading}
            className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-wait transition-colors font-medium"
          >
            {isBioLoading ? (
              <SpinnerIcon className="w-4 h-4 animate-spin" />
            ) : (
              <SparklesIcon className="w-4 h-4" />
            )}
            <span>{isBioLoading ? 'Generating...' : 'Generate with AI'}</span>
          </button>
        </div>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          value={data.personalInfo.bio}
          onChange={e => handleChange(e, 'personalInfo')}
          onBlur={handleBlur}
          placeholder="A brief introduction about yourself..."
          className={`w-full bg-background border ${errors.bio ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-color focus:border-primary focus:ring-primary'} rounded-md px-3 py-2 text-text-primary transition-colors`}
        />
        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
      </div>

      <InputField label="Avatar URL" name="avatar" value={data.personalInfo.avatar} onChange={e => handleChange(e, 'personalInfo')} onBlur={handleBlur} placeholder="https://example.com/avatar.jpg" error={errors.avatar}/>
      <InputField label="Hero Image URL" name="heroImage" value={data.personalInfo.heroImage} onChange={e => handleChange(e, 'personalInfo')} onBlur={handleBlur} placeholder="https://example.com/hero-background.jpg" error={errors.heroImage}/>
      <InputField label="CV Download URL" name="cvFileUrl" value={data.personalInfo.cvFileUrl} onChange={e => handleChange(e, 'personalInfo')} onBlur={handleBlur} placeholder="e.g., /my-cv.pdf or https://..." error={errors.cvFileUrl}/>
      
      <h4 className="text-lg font-bold text-text-primary mt-6 mb-2">Contact Info</h4>
      <InputField label="Email" name="email" type="email" value={data.personalInfo.contact.email} onChange={e => handleChange(e, 'contact')} onBlur={handleBlur} placeholder="your.email@example.com" error={errors.email}/>
      <InputField label="Portfolio URL" name="portfolio" value={data.personalInfo.contact.portfolio} onChange={e => handleChange(e, 'contact')} onBlur={handleBlur} placeholder="https://your-portfolio.com" error={errors.portfolio}/>
      <InputField label="LinkedIn URL" name="linkedin" value={data.personalInfo.contact.linkedin} onChange={e => handleChange(e, 'contact')} onBlur={handleBlur} placeholder="https://linkedin.com/in/yourprofile" error={errors.linkedin}/>
      <InputField label="GitHub URL" name="github" value={data.personalInfo.contact.github} onChange={e => handleChange(e, 'contact')} onBlur={handleBlur} placeholder="https://github.com/yourusername" error={errors.github}/>
    </AdminSection>
  );
};

export default PersonalInfoSettings;