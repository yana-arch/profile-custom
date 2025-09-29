import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Project } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import RichTextEditor from '../form/RichTextEditor';
import { isValidUrl } from '../../../utils/validation';
import { Bars3Icon, SparklesIcon, SpinnerIcon } from '../../icons/Icons';
import { generateContent } from '../../../utils/ai';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type ProjectErrors = Partial<Record<keyof Omit<Project, 'id' | 'description' | 'tags'>, string>>;

const ProjectsSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<ProjectErrors[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [generatingStates, setGeneratingStates] = useState<Record<string, boolean>>({});
  const dragItemIndex = useRef<number | null>(null);
  
  const setGenerating = (id: string, value: boolean) => {
    setGeneratingStates(prev => ({...prev, [id]: value}));
  };

  const validateField = (name: string, value: string): string => {
    if (name === 'name' && !value.trim()) {
      return 'Project name is required.';
    }
    if ((name === 'image' || name === 'repoLink' || name === 'demoLink') && value && !isValidUrl(value)) {
      return 'Please enter a valid URL.';
    }
    return '';
  };
  
  const handleBlur = (index: number, e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => {
        const newErrors = [...prev];
        if (!newErrors[index]) newErrors[index] = {};
        newErrors[index][name as keyof ProjectErrors] = error;
        return newErrors;
    });
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => {
      const newItems = [...prev.projects];
      if (name === 'tags') {
         newItems[index] = { ...newItems[index], tags: value.split(',').map(s => s.trim()).filter(Boolean) };
      } else {
        newItems[index] = { ...newItems[index], [name]: value };
      }
      return { ...prev, projects: newItems };
    });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setData(prev => {
        const newItems = [...prev.projects];
        newItems[index] = { ...newItems[index], description: value };
        return { ...prev, projects: newItems };
    });
  };
  
  const generateDescription = async (index: number) => {
    if (!data.settings.ai.apiKey) {
      alert('Please configure your AI API key in the AI Settings tab.');
      return;
    }
    const project = data.projects[index];
    setGenerating(`desc_${project.id}`, true);
    const prompt = `Write a compelling project description for a project named "${project.name}". Describe its purpose, key features, and the technology stack used. Present it as a paragraph inside <p> tags.`;
    const result = await generateContent(data.settings.ai, prompt);
    if (result) {
      handleDescriptionChange(index, result);
    }
    setGenerating(`desc_${project.id}`, false);
  };
  
  const suggestTags = async (index: number) => {
    if (!data.settings.ai.apiKey) {
      alert('Please configure your AI API key in the AI Settings tab.');
      return;
    }
    const project = data.projects[index];
    setGenerating(`tags_${project.id}`, true);
    const prompt = `Based on the following project description, list the key technologies or concepts as tags. Return only a comma-separated list (e.g., E-commerce, React, Stripe):\n\n${project.description.replace(/<[^>]+>/g, '')}`;
    const result = await generateContent(data.settings.ai, prompt);
    if (result) {
        const newTags = result.split(',').map(s => s.trim()).filter(Boolean);
        setData(prev => {
            const newItems = [...prev.projects];
            const currentTags = newItems[index].tags || [];
            const mergedTags = [...new Set([...currentTags, ...newTags])];
            newItems[index].tags = mergedTags;
            return { ...prev, projects: newItems };
        });
    }
    setGenerating(`tags_${project.id}`, false);
  };

  const addItem = () => {
    const newItem: Project = {id: uuidv4(), name: '', description: '', image: '', repoLink: '', demoLink: '', tags: []};
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newItem]
    }));
  };

  const removeItem = (index: number) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
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
      const newItems = [...prev.projects];
      const draggedItemContent = newItems.splice(dragItemIndex.current!, 1)[0];
      newItems.splice(index, 0, draggedItemContent);
      dragItemIndex.current = index;
      return { ...prev, projects: newItems };
    });
  };

  const handleDragEnd = () => {
    dragItemIndex.current = null;
    setDraggedItem(null);
  };

  return (
    <AdminSection title="Projects">
      {data.projects.map((project, index) => (
        <div 
          key={project.id} 
          className={`border border-border-color p-4 rounded-md mb-4 transition-opacity ${draggedItem === index ? 'opacity-50' : ''}`}
          draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-color/50 cursor-grab active:cursor-grabbing">
            <h4 className="text-md font-semibold text-text-primary truncate pr-2">{project.name || 'New Project'}</h4>
            <Bars3Icon className="w-6 h-6 text-text-secondary flex-shrink-0"/>
          </div>
          <InputField label="Project Name" name="name" value={project.name} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., E-commerce Platform" error={errors[index]?.name}/>
          
          <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-text-secondary">Description</label>
                <button
                    onClick={() => generateDescription(index)}
                    disabled={generatingStates[`desc_${project.id}`]}
                    className="bg-secondary/80 hover:bg-secondary text-white px-3 py-1 text-xs rounded-md flex items-center disabled:opacity-50"
                  >
                    {generatingStates[`desc_${project.id}`] ? <SpinnerIcon className="w-4 h-4 mr-1 animate-spin" /> : <SparklesIcon className="w-4 h-4 mr-1" />}
                    Generate
                </button>
              </div>
              <RichTextEditor name={`description-${project.id}`} value={project.description} onChange={value => handleDescriptionChange(index, value)} />
          </div>

          <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor={`tags-${project.id}`} className="block text-sm font-medium text-text-secondary">Tags (comma-separated)</label>
                 <button
                    onClick={() => suggestTags(index)}
                    disabled={!project.description || generatingStates[`tags_${project.id}`]}
                    className="bg-secondary/80 hover:bg-secondary text-white px-3 py-1 text-xs rounded-md flex items-center disabled:opacity-50"
                  >
                    {generatingStates[`tags_${project.id}`] ? <SpinnerIcon className="w-4 h-4 mr-1 animate-spin" /> : <SparklesIcon className="w-4 h-4 mr-1" />}
                    Suggest
                </button>
              </div>
              <InputField
                  label=""
                  name="tags"
                  value={Array.isArray(project.tags) ? project.tags.join(', ') : ''}
                  onChange={e => handleItemChange(index, e)}
                  placeholder="e.g., React, Node.js, Stripe"
              />
          </div>

          <InputField label="Image URL" name="image" value={project.image} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://example.com/project.png" error={errors[index]?.image}/>
          <InputField label="Repository URL" name="repoLink" value={project.repoLink} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://github.com/user/repo" error={errors[index]?.repoLink}/>
          <InputField label="Demo URL" name="demoLink" value={project.demoLink} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://project-demo.com" error={errors[index]?.demoLink}/>
          <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 text-sm mt-2">Remove</button>
        </div>
      ))}
      <button onClick={addItem} className="bg-primary text-white px-4 py-2 rounded-md">Add Project</button>
    </AdminSection>
  );
};

export default ProjectsSettings;