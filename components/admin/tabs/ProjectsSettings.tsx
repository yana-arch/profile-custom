import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Project } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import RichTextEditor from '../form/RichTextEditor';
import { isValidUrl } from '../../../utils/validation';
import { Bars3Icon } from '../../icons/Icons';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type ProjectErrors = Partial<Record<keyof Omit<Project, 'id' | 'tags' | 'description'>, string>>;

const ProjectsSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<ProjectErrors[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);


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
          <RichTextEditor 
            label="Description" 
            name={`description-${proj.id}`}
            value={proj.description} 
            onChange={value => handleDescriptionChange(index, value)}
          />
          <InputField label="Image URL" name="image" value={proj.image} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://example.com/project-image.jpg" error={errors[index]?.image}/>
          <InputField label="Demo Link" name="demoLink" value={proj.demoLink} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://live-demo.com" error={errors[index]?.demoLink}/>
          <InputField label="Repo Link" name="repoLink" value={proj.repoLink} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://github.com/user/repo" error={errors[index]?.repoLink}/>
          <InputField label="Tags (comma-separated)" name="tags" value={proj.tags.join(', ')} onChange={e => handleTagsChange(index, e)} placeholder="e.g., React, Node.js, MongoDB" />
          <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 text-sm mt-2">Remove</button>
        </div>
      ))}
      <button onClick={addItem} className="bg-primary text-white px-4 py-2 rounded-md">Add Project</button>
    </AdminSection>
  );
};

export default ProjectsSettings;