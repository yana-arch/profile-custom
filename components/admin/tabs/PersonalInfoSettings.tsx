import React, { useState } from 'react';
import { ProfileData } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import TextAreaField from '../form/TextAreaField';
import { isValidUrl, isValidEmail } from '../../../utils/validation';
import { generateContent } from '../../../utils/ai';
import { SparklesIcon, SpinnerIcon } from '../../icons/Icons';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

// Use a more specific type to prevent latent bugs where contact could be a string.
type PersonalInfoErrors = {
  [K in keyof Omit<ProfileData['personalInfo'], 'contact'>]?: string;
} & {
  contact?: { [K in keyof ProfileData['personalInfo']['contact']]?: string; }
};

const PersonalInfoSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<PersonalInfoErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const validateField = (name: string, value: string): string => {
    if (name === 'name' && !value.trim()) {
      return 'Name is required.';
    }
    if ((name === 'avatar' || name === 'heroImage' || name === 'cvFileUrl') && value && !isValidUrl(value)) {
      return 'Please enter a valid URL.';
    }
    return '';
  };
  
  const validateContactField = (name: string, value: string): string => {
    if(name === 'email' && value && !isValidEmail(value)) {
        return 'Please enter a valid email address.';
    }
    if (name !== 'email' && value && !isValidUrl(value)) {
        return 'Please enter a valid URL.';
    }
    return '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleContactBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateContactField(name, value);
    setErrors(prev => ({
        ...prev,
        contact: { ...(prev.contact || {}), [name]: error }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
        ...prev,
        personalInfo: {
            ...prev.personalInfo,
            contact: { ...prev.personalInfo.contact, [name]: value }
        }
    }));
  };
  
  const generateBio = async () => {
    if (!data.settings.ai.apiKey) {
      alert('Please configure your AI API key in the AI Settings tab.');
      return;
    }
    setIsGenerating(true);
    const prompt = `Write a professional bio for a ${data.personalInfo.title}. Keep it concise, engaging, and in the first person. Highlight key skills and passion for the field.`;
    const result = await generateContent(data.settings.ai, prompt);
    if (result) {
      setData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, bio: result.trim() }
      }));
    }
    setIsGenerating(false);
  };

  return (
    <AdminSection title="Personal Information">
      <InputField label="Full Name" name="name" value={data.personalInfo.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} />
      <InputField label="Job Title" name="title" value={data.personalInfo.title} onChange={handleChange} onBlur={handleBlur} error={errors.title} />
      <InputField label="Avatar URL" name="avatar" value={data.personalInfo.avatar} onChange={handleChange} onBlur={handleBlur} error={errors.avatar} />
      <InputField label="Hero Background Image URL" name="heroImage" value={data.personalInfo.heroImage} onChange={handleChange} onBlur={handleBlur} error={errors.heroImage} />
      <div className="mb-4">
        <label htmlFor="bio" className="block text-sm font-medium text-text-secondary mb-1">Bio</label>
        <div className="relative">
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={data.personalInfo.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full bg-background border ${errors.bio ? 'border-red-500' : 'border-border-color'} rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary transition-colors pr-28`}
          />
          <button
            onClick={generateBio}
            disabled={isGenerating}
            className="absolute top-2 right-2 bg-secondary/80 hover:bg-secondary text-white px-3 py-1 text-sm rounded-md flex items-center disabled:opacity-50"
          >
            {isGenerating ? <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" /> : <SparklesIcon className="w-4 h-4 mr-2" />}
            Generate
          </button>
        </div>
        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
      </div>
      <h4 className="text-lg font-bold text-text-primary mt-6 mb-2">Contact & Links</h4>
      <InputField label="Email" name="email" type="email" value={data.personalInfo.contact.email} onChange={handleContactChange} onBlur={handleContactBlur} error={errors.contact?.email} />
      <InputField label="LinkedIn URL" name="linkedin" value={data.personalInfo.contact.linkedin} onChange={handleContactChange} onBlur={handleContactBlur} error={errors.contact?.linkedin} />
      <InputField label="GitHub URL" name="github" value={data.personalInfo.contact.github} onChange={handleContactChange} onBlur={handleContactBlur} error={errors.contact?.github} />
      <InputField label="Portfolio/Website URL" name="portfolio" value={data.personalInfo.contact.portfolio} onChange={handleContactChange} onBlur={handleContactBlur} error={errors.contact?.portfolio} />
      <InputField label="CV/Resume File URL" name="cvFileUrl" value={data.personalInfo.cvFileUrl} onChange={handleChange} onBlur={handleBlur} error={errors.cvFileUrl} />
    </AdminSection>
  );
};

export default PersonalInfoSettings;