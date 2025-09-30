import React, { useState } from 'react';
import InputField from './admin/form/InputField';
import { SparklesIcon } from './icons/Icons';

interface OnboardingProps {
  onComplete: (name: string, title: string, useAi: boolean) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [nameError, setNameError] = useState('');

  const handleSubmit = (useAi: boolean) => {
    if (!name.trim()) {
      setNameError('Please enter your name.');
      return;
    }
    setNameError('');
    onComplete(name, title, useAi);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-card-background p-8 rounded-lg shadow-xl max-w-lg w-full border border-border-color animate-slideUp">
        <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">Welcome to MyDynamicProfile!</h1>
        <p className="text-text-secondary mb-6 text-center">Let's get your new profile set up in seconds.</p>
        
        <div className="space-y-4">
          <InputField 
            label="Your Full Name"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError('');
            }}
            placeholder="e.g., Jane Doe"
            error={nameError}
          />
          <InputField 
            label="Your Professional Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Software Engineer"
          />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => handleSubmit(false)}
              className="dynamic-button w-full text-center bg-secondary hover:opacity-90 text-white font-bold py-3 px-4"
            >
                Start Manually
            </button>
            <button 
              onClick={() => handleSubmit(true)}
              className="dynamic-button w-full text-center bg-primary hover:opacity-90 text-white font-bold py-3 px-4 flex items-center justify-center gap-2"
            >
                <SparklesIcon className="w-5 h-5"/>
                Use AI Wizard
            </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;