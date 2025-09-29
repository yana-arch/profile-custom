import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Experience } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import RichTextEditor from '../form/RichTextEditor';
import { Bars3Icon, SparklesIcon, SpinnerIcon } from '../../icons/Icons';
import { generateContent } from '../../../utils/ai';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type ExperienceErrors = Partial<Record<keyof Omit<Experience, 'id' | 'description' | 'skillsUsed'>, string>>;

const ExperienceSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<ExperienceErrors[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [generatingStates, setGeneratingStates] = useState<Record<string, boolean>>({});
  const dragItemIndex = useRef<number | null>(null);

  const setGenerating = (id: string, value: boolean) => {
    setGeneratingStates(prev => ({...prev, [id]: value}));
  };

  const validateField = (name: string, value: string): string => {
    if ((name === 'title' || name === 'company') && !value.trim()) {
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
      if (name === 'skillsUsed') {
        newItems[index] = { ...newItems[index], skillsUsed: value.split(',').map(s => s.trim()).filter(Boolean) };
      } else {
        newItems[index] = { ...newItems[index], [name]: value };
      }
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
  
  const generateDescription = async (index: number) => {
    if (!data.settings.ai.apiKey) {
      alert('Please configure your AI API key in the AI Settings tab.');
      return;
    }
    const job = data.experience[index];
    setGenerating(`desc_${job.id}`, true);
    const prompt = `Write a professional job description for a ${job.title} at ${job.company}. Focus on key responsibilities and achievements. Present it as a bulleted list within <ul> tags.`;
    const result = await generateContent(data.settings.ai, prompt);
    if (result) {
      handleDescriptionChange(index, result);
    }
    setGenerating(`desc_${job.id}`, false);
  };

  const suggestSkills = async (index: number) => {
    if (!data.settings.ai.apiKey) {
      alert('Please configure your AI API key in the AI Settings tab.');
      return;
    }
    const job = data.experience[index];
    setGenerating(`skills_${job.id}`, true);
    const prompt = `Based on the following job description, list the key skills and technologies used. Return only a comma-separated list (e.g., React, TypeScript, AWS):\n\n${job.description.replace(/<[^>]+>/g, '')}`;
    const result = await generateContent(data.settings.ai, prompt);
     if (result) {
        const newSkills = result.split(',').map(s => s.trim()).filter(Boolean);
        setData(prev => {
            const newItems = [...prev.experience];
            const currentSkills = newItems[index].skillsUsed || [];
            const mergedSkills = [...new Set([...currentSkills, ...newSkills])];
            newItems[index].skillsUsed = mergedSkills;
            return { ...prev, experience: newItems };
        });
    }
    setGenerating(`skills_${job.id}`, false);
  };

  const addItem = () => {
    const newItem: Experience = {id: uuidv4(), title: '', company: '', startDate: '', endDate: '', description: '', skillsUsed: []};
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
    if (dragItemIndex.current === null || dragItemIndex.current === index) return;
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
  
  return (
    <AdminSection title="Work Experience">
      {data.experience.map((job, index) => (
        <div 
          key={job.id} 
          className={`border border-border-color p-4 rounded-md mb-4 transition-opacity ${draggedItem === index ? 'opacity-50' : ''}`}
          draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-color/50 cursor-grab active:cursor-grabbing">
            <h4 className="text-md font-semibold text-text-primary truncate pr-2">{job.title || 'New Job'}</h4>
            <Bars3Icon className="w-6 h-6 text-text-secondary flex-shrink-0"/>
          </div>
          <InputField label="Job Title" name="title" value={job.title} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Senior Software Engineer" error={errors[index]?.title}/>
          <InputField label="Company" name="company" value={job.company} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Tech Solutions Inc." error={errors[index]?.company}/>
          <InputField label="Start Date" name="startDate" value={job.startDate} onChange={e => handleItemChange(index, e)} placeholder="e.g., Jan 2020"/>
          <InputField label="End Date" name="endDate" value={job.endDate} onChange={e => handleItemChange(index, e)} placeholder="e.g., Present"/>
          
          <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-text-secondary">Description</label>
                <button
                    onClick={() => generateDescription(index)}
                    disabled={generatingStates[`desc_${job.id}`]}
                    className="bg-secondary/80 hover:bg-secondary text-white px-3 py-1 text-xs rounded-md flex items-center disabled:opacity-50"
                  >
                    {generatingStates[`desc_${job.id}`] ? <SpinnerIcon className="w-4 h-4 mr-1 animate-spin" /> : <SparklesIcon className="w-4 h-4 mr-1" />}
                    Generate
                </button>
              </div>
              <RichTextEditor name={`description-${job.id}`} value={job.description} onChange={value => handleDescriptionChange(index, value)} />
          </div>

          <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor={`skillsUsed-${job.id}`} className="block text-sm font-medium text-text-secondary">Skills Used (comma-separated)</label>
                <button
                    onClick={() => suggestSkills(index)}
                    disabled={!job.description || generatingStates[`skills_${job.id}`]}
                    className="bg-secondary/80 hover:bg-secondary text-white px-3 py-1 text-xs rounded-md flex items-center disabled:opacity-50"
                  >
                    {generatingStates[`skills_${job.id}`] ? <SpinnerIcon className="w-4 h-4 mr-1 animate-spin" /> : <SparklesIcon className="w-4 h-4 mr-1" />}
                    Suggest
                </button>
              </div>
              <InputField
                  label=""
                  name="skillsUsed"
                  value={Array.isArray(job.skillsUsed) ? job.skillsUsed.join(', ') : ''}
                  onChange={e => handleItemChange(index, e)}
                  placeholder="e.g., React, Node.js, AWS"
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