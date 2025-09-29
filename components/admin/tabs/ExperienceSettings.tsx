import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import { GoogleGenAI } from "@google/genai";
import { ProfileData, Experience } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import { Bars3Icon, SparklesIcon, SpinnerIcon } from '../../icons/Icons';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type ExperienceErrors = Partial<Record<keyof Omit<Experience, 'id' | 'skillsUsed' | 'description'>, string>>;

const ExperienceSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<ExperienceErrors[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [suggestingSkillsIndex, setSuggestingSkillsIndex] = useState<number | null>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const validateField = (name: string, value: string): string => {
    if ((name === 'company' || name === 'title') && !value.trim()) {
      return 'This field is required.';
    }
    return '';
  };
  
  const handleBlur = (index: number, e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => {
        const newErrors = [...prev];
        if (!newErrors[index]) newErrors[index] = {};
        newErrors[index][name as keyof ExperienceErrors] = error;
        return newErrors;
    });
  };
  
  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => {
      const newItems = [...prev.experience];
      newItems[index] = { ...newItems[index], [name]: value };
      return { ...prev, experience: newItems };
    });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setData(prev => {
        const newItems = [...prev.experience];
        newItems[index] = { ...newItems[index], description: value };
        return { ...prev, experience: newItems };
    });
  };

  const handleSkillsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const skills = value.split(',').map(s => s.trim()).filter(Boolean);
    setData(prev => {
        const newItems = [...prev.experience];
        newItems[index] = { ...newItems[index], skillsUsed: skills };
        return { ...prev, experience: newItems };
    });
  };

  const addItem = () => {
    const newItem: Experience = {id: uuidv4(), company: '', title: '', startDate: '', endDate: '', description: '', skillsUsed: []};
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, newItem]
    }));
  };

  const removeItem = (index: number) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
    setErrors(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItemIndex.current = index;
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index: number) => {
    if (dragItemIndex.current === null || dragItemIndex.current === index) {
      return;
    }
    setData(prev => {
      const newItems = [...prev.experience];
      const draggedItemContent = newItems.splice(dragItemIndex.current!, 1)[0];
      newItems.splice(index, 0, draggedItemContent);
      dragItemIndex.current = index;
      return { ...prev, experience: newItems };
    });
  };

  const handleDragEnd = () => {
    dragItemIndex.current = null;
    setDraggedItem(null);
  };

  const generateDescription = async (index: number) => {
    const exp = data.experience[index];
    if (!exp.title || !exp.company) {
        alert('Please enter a Title and Company first to generate a description.');
        return;
    }
    setGeneratingIndex(index);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const prompt = `Write a professional job description for a "${exp.title}" at "${exp.company}". Focus on key responsibilities and achievements. The output should be a short paragraph in HTML format, suitable for a rich text editor. For example: <p>Developed and maintained features for a large-scale e-commerce platform. Collaborated with UI/UX designers to implement pixel-perfect designs and improve user engagement by 15%.</p>`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text;
        if (!text) {
          throw new Error("No text returned from API for description generation.");
        }
        const generatedDesc = text.replace(/```html|```/g, '').trim();
        
        setData(prev => {
            const newItems = [...prev.experience];
            newItems[index] = { ...newItems[index], description: generatedDesc };
            return { ...prev, experience: newItems };
        });
    } catch (error) {
        console.error("Error generating description:", error);
        alert("Sorry, there was an error generating the description. Please try again.");
    } finally {
        setGeneratingIndex(null);
    }
  };
  
  const suggestSkills = async (index: number) => {
    const exp = data.experience[index];
    if (!exp.description) {
        alert('Please generate or write a description first to suggest skills.');
        return;
    }
    setSuggestingSkillsIndex(index);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const prompt = `Based on the following job description, list the key technical skills, frameworks, and libraries mentioned. Return ONLY a comma-separated list of skills (e.g., React, TypeScript, Redux, SCSS). Do not add any other text or formatting.\n\nDescription:\n${exp.description.replace(/<[^>]*>?/gm, ' ')}`; // strip HTML tags for better analysis
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const suggestedSkillsText = response.text;
        if (!suggestedSkillsText) {
            console.error("No text returned from API for skill suggestion.");
            alert("Sorry, the AI couldn't suggest any skills for this description.");
            return;
        }
        const suggestedSkills = suggestedSkillsText.trim().split(',').map(s => s.trim()).filter(Boolean);
        
        setData(prev => {
            const newItems = [...prev.experience];
            // Merge skills, avoiding duplicates
            const currentSkills = new Set(newItems[index].skillsUsed);
            suggestedSkills.forEach(skill => currentSkills.add(skill));
            newItems[index] = { ...newItems[index], skillsUsed: Array.from(currentSkills) };
            return { ...prev, experience: newItems };
        });
    } catch (error) {
        console.error("Error suggesting skills:", error);
        alert("Sorry, there was an error suggesting skills. Please try again.");
    } finally {
        setSuggestingSkillsIndex(null);
    }
  };


  return (
    <AdminSection title="Work Experience">
      {data.experience.map((exp, index) => (
        <div 
          key={exp.id} 
          className={`border border-border-color p-4 rounded-md mb-4 transition-opacity ${draggedItem === index ? 'opacity-50' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-color/50 cursor-grab active:cursor-grabbing">
            <h4 className="text-md font-semibold text-text-primary truncate pr-2">{exp.title || 'New Experience'}</h4>
            <Bars3Icon className="w-6 h-6 text-text-secondary flex-shrink-0"/>
          </div>
          <InputField label="Company" name="company" value={exp.company} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., GlobalTech Solutions" error={errors[index]?.company}/>
          <InputField label="Title" name="title" value={exp.title} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Senior Frontend Developer" error={errors[index]?.title}/>
          <InputField label="Start Date" name="startDate" value={exp.startDate} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., 2021" error={errors[index]?.startDate}/>
          <InputField label="End Date" name="endDate" value={exp.endDate} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Present" error={errors[index]?.endDate}/>
          
          <div className="mb-4 rich-text-editor">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor={`description-${exp.id}`} className="block text-sm font-medium text-text-secondary">Description</label>
              <button
                type="button"
                onClick={() => generateDescription(index)}
                disabled={generatingIndex === index}
                className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-wait transition-colors font-medium"
              >
                {generatingIndex === index ? (
                  <SpinnerIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <SparklesIcon className="w-4 h-4" />
                )}
                <span>{generatingIndex === index ? 'Generating...' : 'Generate with AI'}</span>
              </button>
            </div>
            <ReactQuill
              theme="snow"
              value={exp.description}
              onChange={value => handleDescriptionChange(index, value)}
              modules={modules}
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <label htmlFor={`skillsUsed-${exp.id}`} className="block text-sm font-medium text-text-secondary">Skills Used (comma-separated)</label>
                {exp.description && (
                    <button
                        type="button"
                        onClick={() => suggestSkills(index)}
                        disabled={suggestingSkillsIndex === index}
                        className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-wait transition-colors font-medium"
                    >
                        {suggestingSkillsIndex === index ? (
                            <SpinnerIcon className="w-4 h-4 animate-spin" />
                        ) : (
                            <SparklesIcon className="w-4 h-4" />
                        )}
                        <span>{suggestingSkillsIndex === index ? 'Suggesting...' : 'Suggest with AI'}</span>
                    </button>
                )}
            </div>
            <input
                id={`skillsUsed-${exp.id}`}
                name="skillsUsed"
                type="text"
                value={exp.skillsUsed.join(', ')}
                onChange={e => handleSkillsChange(index, e)}
                placeholder="e.g., React, TypeScript, Redux"
                className="w-full bg-background border border-border-color focus:border-primary focus:ring-primary rounded-md px-3 py-2 text-text-primary transition-colors"
            />
          </div>

          <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 text-sm mt-2">Remove</button>
        </div>
      ))}
      <button onClick={addItem} className="bg-primary text-white px-4 py-2 rounded-md">Add Experience</button>
    </AdminSection>
  );
};

export default ExperienceSettings;