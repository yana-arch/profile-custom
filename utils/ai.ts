import { GoogleGenAI, Type } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import { AiSettings, ProfileData } from '../types';

export async function generateContent(settings: AiSettings, prompt: string): Promise<string | null> {
  try {
    switch (settings.provider) {
      case 'gemini':
        // FIX: Per @google/genai guidelines, API key must come from process.env.API_KEY
        const geminiApiKey = process.env.API_KEY;
        if (!geminiApiKey) {
          throw new Error('The Gemini API key is not configured. Please set the API_KEY environment variable.');
        }
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
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


const profileSchema = {
    type: Type.OBJECT,
    properties: {
        personalInfo: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "The user's full name." },
                title: { type: Type.STRING, description: "The user's professional title." },
                bio: { type: Type.STRING, description: "A short professional biography in the first person." },
                contact: {
                    type: Type.OBJECT,
                    properties: {
                        email: { type: Type.STRING, description: "The user's email address." },
                        linkedin: { type: Type.STRING, description: "URL to the user's LinkedIn profile." },
                        github: { type: Type.STRING, description: "URL to the user's GitHub profile." },
                        portfolio: { type: Type.STRING, description: "URL to the user's personal portfolio or website." },
                    }
                }
            }
        },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    startDate: { type: Type.STRING, description: "e.g., 'Jan 2020' or '2019'" },
                    endDate: { type: Type.STRING, description: "e.g., 'Present' or 'Dec 2022'" },
                    description: { type: Type.STRING, description: "A description of responsibilities and achievements, formatted with simple HTML tags like <p>, <ul>, and <li>." },
                    skillsUsed: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    school: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    fieldOfStudy: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.STRING, description: "A brief description, formatted with <p> tag." }
                }
            }
        },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING, description: "A project description, formatted with <p> tag." },
                    repoLink: { type: Type.STRING, description: "URL to the project's code repository." },
                    demoLink: { type: Type.STRING, description: "URL to a live demo of the project." },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        },
        skills: {
            type: Type.OBJECT,
            properties: {
                frontend: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            level: { type: Type.NUMBER, description: "A proficiency score from 1 to 100." }
                        }
                    }
                },
                backend: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            level: { type: Type.NUMBER, description: "A proficiency score from 1 to 100." }
                        }
                    }
                },
                tools: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            level: { type: Type.NUMBER, description: "A proficiency score from 1 to 100." }
                        }
                    }
                }
            }
        },
        certifications: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    issuingOrganization: { type: Type.STRING },
                    date: { type: Type.STRING, description: "The year the certification was obtained." },
                    credentialUrl: { type: Type.STRING, description: "A URL to verify the credential." }
                }
            }
        }
    }
};

export async function generateProfileFromDescription(settings: AiSettings, description: string): Promise<Partial<ProfileData> | null> {
    const prompt = `Based on the following description, generate a complete professional profile in JSON format. Extract or infer information for personal details, work experience, education, projects, skills, and certifications. If some information is missing, make reasonable assumptions or leave fields/arrays empty where appropriate. Do not invent placeholder image URLs.

User's description:
---
${description}
---

Adhere strictly to the provided JSON schema.`;
    
    try {
        if (settings.provider !== 'gemini') {
            alert('This feature currently only supports the Google Gemini provider.');
            return null;
        }

        // FIX: Per @google/genai guidelines, API key must come from process.env.API_KEY
        const geminiApiKey = process.env.API_KEY;
        if (!geminiApiKey) {
          throw new Error('The Gemini API key is not configured. Please set the API_KEY environment variable.');
        }
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: profileSchema,
            },
        });
        
        const jsonText = response.text;
        const generatedData = JSON.parse(jsonText);

        // Add UUIDs to all array items
        generatedData.experience?.forEach((item: any) => item.id = uuidv4());
        generatedData.education?.forEach((item: any) => item.id = uuidv4());
        generatedData.projects?.forEach((item: any) => item.id = uuidv4());
        generatedData.skills?.frontend?.forEach((item: any) => item.id = uuidv4());
        generatedData.skills?.backend?.forEach((item: any) => item.id = uuidv4());
        generatedData.skills?.tools?.forEach((item: any) => item.id = uuidv4());
        generatedData.certifications?.forEach((item: any) => item.id = uuidv4());

        return generatedData;

    } catch (error) {
        console.error('AI profile generation error:', error);
        alert(`An error occurred while generating the profile: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
}

export async function generatePlaceholderImages(
  settings: AiSettings, 
  name: string, 
  title: string
): Promise<{ avatar: string; heroImage: string } | null> {
  try {
    if (settings.provider !== 'gemini') {
      alert('Image generation currently only supports the Google Gemini provider.');
      return null;
    }
    
    // FIX: Per @google/genai guidelines, API key must come from process.env.API_KEY
    const geminiApiKey = process.env.API_KEY;
    if (!geminiApiKey) {
      throw new Error('The Gemini API key is not configured. Please set the API_KEY environment variable.');
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const [avatarResponse, heroResponse] = await Promise.all([
      // Avatar Generation
      ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A professional, abstract avatar representing a ${title}. Modern, clean design, suitable for a circular profile picture. No faces or text.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      }),
      // Hero Image Generation
      ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A professional, abstract background image suitable for a portfolio website for a ${title}. Tech-themed, minimalist, high-resolution, calming color palette. Aspect ratio 16:9.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
      }),
    ]);

    const avatarBase64 = avatarResponse.generatedImages[0]?.image.imageBytes;
    const heroImageBase64 = heroResponse.generatedImages[0]?.image.imageBytes;

    if (!avatarBase64 || !heroImageBase64) {
      throw new Error('Image generation failed to return one or more images.');
    }

    return {
      avatar: `data:image/jpeg;base64,${avatarBase64}`,
      heroImage: `data:image/jpeg;base64,${heroImageBase64}`,
    };

  } catch (error) {
    console.error('AI image generation error:', error);
    alert(`An error occurred while generating images: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}
