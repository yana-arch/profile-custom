import { GoogleGenAI } from '@google/genai';
import { AiSettings } from '../types';

export async function generateContent(settings: AiSettings, prompt: string): Promise<string | null> {
  try {
    switch (settings.provider) {
      case 'gemini':
        const ai = new GoogleGenAI({ apiKey: settings.apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        return response.text;

      case 'openrouter':
        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${settings.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://mydynamicprofile.com', // Replace with your actual site
            'X-Title': 'MyDynamicProfile', // Replace with your actual site name
          },
          body: JSON.stringify({
            model: settings.openRouterModel || 'google/gemini-pro',
            messages: [{ role: 'user', content: prompt }],
          }),
        });
        if (!openRouterResponse.ok) {
          const error = await openRouterResponse.json();
          throw new Error(error.error.message || 'OpenRouter API request failed');
        }
        const openRouterData = await openRouterResponse.json();
        return openRouterData.choices[0].message.content;

      case 'custom':
        if (!settings.customApiUrl) {
            throw new Error('Custom API URL is not configured.');
        }
        const customResponse = await fetch(settings.customApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${settings.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: settings.customModel || 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (!customResponse.ok) {
          throw new Error('Custom API request failed');
        }
        const customData = await customResponse.json();
        return customData.choices[0].message.content;

      default:
        return null;
    }
  } catch (error) {
    console.error('AI generation error:', error);
    alert(`An error occurred while generating content: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}