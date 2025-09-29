import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import { GoogleGenAI } from "@google/genai";
import { ProfileData, Project } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import { isValidUrl } from '../../../utils/validation';
import { Bars3Icon, SparklesIcon, SpinnerIcon } from '../../icons/Icons';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type ProjectErrors = Partial<Record<keyof Omit<Project, 'id' | 'tags' | 'description'>, string>>;

const ProjectsSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<ProjectErrors[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [suggestingTagsIndex, setSuggestingTagsIndex] = useState<number | null>(null);

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
    if (name === 'name' && !value.trim()) {
      return 'Project name is required.';
    }
    if ((name === 'image' || name === 'demoLink' || name === 'repoLink') && value && !isValidUrl(value)) {
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
      newItems[index] = { ...newItems[index], [name]: value };
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

  const handleTagsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const tags = value.split(',').map(s => s.trim()).filter(Boolean);
    setData(prev => {
        const newItems = [...prev.projects];
        newItems[index] = { ...newItems[index], tags };
        return { ...prev, projects: newItems };
    });
  };

  const addItem = () => {
    const newItem: Project = {id: uuidv4(), name: '', description: '', demoLink: '', repoLink: '', image: 'https://picsum.photos/400/300', tags: []};
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
    if (dragItemIndex.current === null || dragItemIndex.current === index) {
      return;
    }
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

  const generateDescription = async (index: number) => {
    const proj = data.projects[index];
    if (!proj.name) {
        alert('Please enter a Project Name first to generate a description.');
        return;
    }
    setGeneratingIndex(index);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const prompt = `Write a compelling project description for a project named "${proj.name}". The output should be a short paragraph in HTML format, suitable for a rich text editor. For example: <p>A full-featured e-commerce website with product listings, shopping cart, and checkout functionality. Built with React and Node.js, it provides a seamless user experience.</p>`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text;
        if (!text) {
          throw new Error("No text returned from API for project description generation.");
        }
        const generatedDesc = text.replace(/```html|```/g, '').trim();
        
        setData(prev => {
            const newItems = [...prev.projects];
            newItems[index] = { ...newItems[index], description: generatedDesc };
            return { ...prev, projects: newItems };
        });
    } catch (error) {
        console.error("Error generating project description:", error);
        alert("Sorry, there was an error generating the project description. Please try again.");
    } finally {
        setGeneratingIndex(null);
    }
  };

  const suggestTags = async (index: number) => {
    const proj = data.projects[index];
    if (!proj.description) {
        alert('Please generate or write a description first to suggest tags.');
        return;
    }
    setSuggestingTagsIndex(index);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const prompt = `Based on the following project description, list the key technologies, frameworks, and libraries mentioned. Return ONLY a comma-separated list of tags (e.g., React, Node.js, Firebase, Tailwind CSS). Do not add any other text or formatting.\n\nDescription:\n${proj.description.replace(/<[^>]*>?/gm, ' ')}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const suggestedTagsText = response.text;
        if (!suggestedTagsText) {
            console.error("No text returned from API for tag suggestion.");
            alert("Sorry, the AI couldn't suggest any tags for this description.");
            return;
        }
        const suggestedTags = suggestedTagsText.trim().split(',').map(s => s.trim()).filter(Boolean);

        setData(prev => {
            const newItems = [...prev.projects];
            // Merge tags, avoiding duplicates
            const currentTags = new Set(newItems[index].tags);
            suggestedTags.forEach(tag => currentTags.add(tag));
            newItems[index] = { ...newItems[index], tags: Array.from(currentTags) };
            return { ...prev, projects: newItems };
        });
    } catch (error) {
        console.error("Error suggesting tags:", error);
        alert("Sorry, there was an error suggesting tags. Please try again.");
    } finally {
        setSuggestingTagsIndex(null);
    }
  };

  return (
    <AdminSection title="Projects">
      {data.projects.map((proj, index) => (
        <div 
          key={proj.id} 
          className={`border border-border-color p-4 rounded-md mb-4 transition-opacity ${draggedItem === index ? 'opacity-50' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-color/50 cursor-grab active:cursor-grabbing">
            <h4 className="text-md font-semibold text-text-primary truncate pr-2">{proj.name || 'New Project'}</h4>
            <Bars3Icon className="w-6 h-6 text-text-secondary flex-shrink-0"/>
          </div>
          <InputField label="Project Name" name="name" value={proj.name} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., E-commerce Platform" error={errors[index]?.name}/>
          
          <div className="mb-4 rich-text-editor">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor={`description-${proj.id}`} className="block text-sm font-medium text-text-secondary">Description</label>
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
              value={proj.description}
              onChange={value => handleDescriptionChange(index, value)}
              modules={modules}
              placeholder="Describe the project, its features, and the technologies used..."
            />
          </div>

          <InputField label="Image URL" name="image" value={proj.image} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://example.com/project-image.jpg" error={errors[index]?.image}/>
          <InputField label="Demo Link" name="demoLink" value={proj.demoLink} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://live-demo.com" error={errors[index]?.demoLink}/>
          <InputField label="Repo Link" name="repoLink" value={proj.repoLink} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://github.com/user/repo" error={errors[index]?.repoLink}/>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor={`tags-${proj.id}`} className="block text-sm font-medium text-text-secondary">Tags (comma-separated)</label>
              {proj.description && (
                  <button
                      type="button"
                      onClick={() => suggestTags(index)}
                      disabled={suggestingTagsIndex === index}
                      className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-wait transition-colors font-medium"
                  >
                      {suggestingTagsIndex === index ? (
                          <SpinnerIcon className="w-4 h-4 animate-spin" />
                      ) : (
                          <SparklesIcon className="w-4 h-4" />
                      )}
                      <span>{suggestingTagsIndex === index ? 'Suggesting...' : 'Suggest with AI'}</span>
                  </button>
              )}
            </div>
            <input
                id={`tags-${proj.id}`}
                name="tags"
                type="text"
                value={proj.tags.join(', ')}
                onChange={e => handleTagsChange(index, e)}
                placeholder="e.g., React, Node.js, MongoDB"
                className="w-full bg-background border border-border-color focus:border-primary focus:ring-primary rounded-md px-3 py-2 text-text-primary transition-colors"
            />
          </div>

          <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 text-sm mt-2">Remove</button>
        </div>
      ))}
      <button onClick={addItem} className="bg-primary text-white px-4 py-2 rounded-md">Add Project</button>
    </AdminSection>
  );
};

export default ProjectsSettings;