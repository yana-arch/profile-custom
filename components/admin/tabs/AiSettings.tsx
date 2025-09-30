import React from 'react';
import { ProfileData } from '../../../types';
import AdminSection from '../form/AdminSection';
import SelectField from '../form/SelectField';
import InputField from '../form/InputField';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

const AiSettings: React.FC<Props> = ({ data, setData }) => {
  const handleAiChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ai: {
          ...prev.settings.ai,
          [name]: value,
        },
      },
    }));
  };

  return (
    <AdminSection title="AI Settings">
      <p className="text-text-secondary text-sm mb-6">
        Configure your preferred AI provider to power the content generation features. Your API key is stored locally in your browser and is never sent to our servers.
      </p>
      
      <SelectField label="AI Provider" name="provider" value={data.settings.ai.provider} onChange={handleAiChange}>
        <option value="gemini">Google Gemini</option>
        <option value="openrouter">OpenRouter</option>
        <option value="custom">Custom (OpenAI-compatible)</option>
      </SelectField>

      {/* FIX: Per @google/genai guidelines, do not show API key input for Gemini. */}
      {data.settings.ai.provider === 'gemini' && (
        <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 p-4 rounded-md text-sm mb-6">
          <p>The Google Gemini provider uses the <strong>API_KEY</strong> environment variable. No API key is needed here.</p>
        </div>
      )}

      {data.settings.ai.provider !== 'gemini' && (
        <InputField
          label="API Key"
          name="apiKey"
          type="password"
          value={data.settings.ai.apiKey}
          onChange={handleAiChange}
          placeholder="Enter your API key"
        />
      )}


      {data.settings.ai.provider === 'openrouter' && (
        <InputField
          label="OpenRouter Model"
          name="openRouterModel"
          value={data.settings.ai.openRouterModel || ''}
          onChange={handleAiChange}
          placeholder="e.g., google/gemini-pro"
        />
      )}

      {data.settings.ai.provider === 'custom' && (
        <>
          <InputField
            label="Custom API URL"
            name="customApiUrl"
            value={data.settings.ai.customApiUrl || ''}
            onChange={handleAiChange}
            placeholder="e.g., https://api.openai.com/v1/chat/completions"
          />
          <InputField
            label="Custom Model Name"
            name="customModel"
            value={data.settings.ai.customModel || ''}
            onChange={handleAiChange}
            placeholder="e.g., gpt-4"
          />
        </>
      )}
    </AdminSection>
  );
};

export default AiSettings;
