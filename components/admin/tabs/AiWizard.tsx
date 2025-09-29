import React, { useState } from 'react';
import { ProfileData } from '../../../types';
import AdminSection from '../form/AdminSection';
import TextAreaField from '../form/TextAreaField';
import { SparklesIcon, SpinnerIcon } from '../../icons/Icons';
import { generateProfileFromDescription } from '../../../utils/ai';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

const AiWizard: React.FC<Props> = ({ data, setData }) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <AdminSection title="AI Profile Wizard">
      <p className="text-text-secondary text-sm mb-4">
        Describe yourself, your career, and your accomplishments in the text box below. Our AI will analyze your description and automatically generate a complete profile for you. The more detail you provide, the better the result!
      </p>
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-md text-sm mb-6">
        <p><strong>Warning:</strong> This will overwrite existing data in all profile sections (Personal Info, Experience, etc.). AI-generated content may require review and refinement. Please back up your current data using the Export feature in the Display tab if you wish to save it.</p>
      </div>
      
      <TextAreaField
        label="Your Professional Summary"
        name="ai-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={10}
        placeholder="e.g., I am a senior full-stack developer with 8 years of experience, specializing in React and Node.js. I graduated from the University of Technology with a degree in Computer Science..."
      />
      
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="bg-primary text-white px-6 py-2 rounded-md flex items-center justify-center disabled:opacity-50 mt-4"
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
    </AdminSection>
  );
};

export default AiWizard;
