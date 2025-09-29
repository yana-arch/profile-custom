import React, { useState } from 'react';
import { ProfileData } from '../../../types';
import AdminSection from '../form/AdminSection';
import TextAreaField from '../form/TextAreaField';
import { SparklesIcon, SpinnerIcon } from '../../icons/Icons';
import { generateProfileFromDescription, generatePlaceholderImages } from '../../../utils/ai';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

const AiWizard: React.FC<Props> = ({ data, setData }) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const handleGenerate = async () => {
    if (!data.settings.ai.apiKey) {
      alert('Please configure your AI API key in the AI Settings tab.');
      return;
    }
    if (!description.trim()) {
        alert('Please provide a description of yourself.');
        return;
    }

    setIsLoading(true);

    const generatedData = await generateProfileFromDescription(data.settings.ai, description);
    
    if (generatedData) {
      setData(prevData => {
        // Create a new object to avoid direct mutation and ensure re-render
        const newData = { ...prevData };

        // Overwrite sections that were generated, merging personalInfo to keep avatar/hero if not generated
        if (generatedData.personalInfo) {
            newData.personalInfo = {
                ...prevData.personalInfo,
                ...generatedData.personalInfo,
            };
        }
        if (generatedData.experience) newData.experience = generatedData.experience;
        if (generatedData.education) newData.education = generatedData.education;
        if (generatedData.projects) newData.projects = generatedData.projects;
        if (generatedData.skills) newData.skills = generatedData.skills;
        if (generatedData.certifications) newData.certifications = generatedData.certifications;
        
        return newData;
      });
      alert('Profile generated successfully! Please review the updated sections.');
    }
    
    setIsLoading(false);
  };

  const handleSuggestImages = async () => {
    if (!data.settings.ai.apiKey) {
      alert('Please configure your AI API key in the AI Settings tab.');
      return;
    }
    if (!data.personalInfo.name || !data.personalInfo.title) {
        alert('Please generate the profile or fill in your name and title first.');
        return;
    }

    setIsGeneratingImages(true);
    const result = await generatePlaceholderImages(data.settings.ai, data.personalInfo.name, data.personalInfo.title);
    
    if (result) {
        setData(prevData => ({
            ...prevData,
            personalInfo: {
                ...prevData.personalInfo,
                avatar: result.avatar,
                heroImage: result.heroImage,
            }
        }));
        alert('Avatar and hero images generated and applied successfully!');
    }

    setIsGeneratingImages(false);
  };

  return (
    <AdminSection title="AI Profile Wizard">
      <p className="text-text-secondary text-sm mb-4">
        Describe yourself, your career, and your accomplishments in the text box below. Our AI will analyze your description and automatically generate a complete profile for you. The more detail you provide, the better the result!
      </p>
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-md text-sm mb-6">
        <p><strong>Warning:</strong> Using "Generate Profile" will overwrite existing data in all profile sections (Personal Info, Experience, etc.). AI-generated content may require review and refinement. Please back up your current data using the Export feature in the Display tab if you wish to save it.</p>
      </div>
      
      <TextAreaField
        label="Your Professional Summary"
        name="ai-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={10}
        placeholder="e.g., I am a senior full-stack developer with 8 years of experience, specializing in React and Node.js. I graduated from the University of Technology with a degree in Computer Science..."
      />
      
      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={handleGenerate}
          disabled={isLoading || isGeneratingImages}
          className="bg-primary text-white px-6 py-2 rounded-md flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate Profile
            </>
          )}
        </button>
        <button
          onClick={handleSuggestImages}
          disabled={isLoading || isGeneratingImages || !data.personalInfo.name || !data.personalInfo.title}
          className="bg-secondary text-white px-6 py-2 rounded-md flex items-center justify-center disabled:opacity-50 disabled:bg-secondary/50 disabled:cursor-not-allowed"
          title={!data.personalInfo.name || !data.personalInfo.title ? 'Generate profile or add name/title first' : 'Suggest placeholder images'}
        >
          {isGeneratingImages ? (
            <>
              <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" />
              Generating Images...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Suggest Images
            </>
          )}
        </button>
      </div>
    </AdminSection>
  );
};

export default AiWizard;