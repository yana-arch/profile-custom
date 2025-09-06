import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Project } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import TextAreaField from '../form/TextAreaField';
import { isValidUrl } from '../../../utils/validation';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type ProjectErrors = Partial<Record<keyof Omit<Project, 'id' | 'tags'>, string>>;

const ProjectsSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<ProjectErrors[]>([]);

  const validateField = (name: string, value: string): string => {
    if (name === 'name' && !value.trim()) {
      return 'Project name is required.';
    }
    if ((name === 'image' || name === 'demoLink' || name === 'repoLink') && value && !isValidUrl(value)) {
      return 'Please enter a valid URL.';
    }
    return '';
  };

  const handleBlur = (index: number, e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => {
        const newErrors = [...prev];
        if (!newErrors[index]) newErrors[index] = {};
        newErrors[index][name as keyof ProjectErrors] = error;
        return newErrors;
    });
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => {
      const newItems = [...prev.projects];
      newItems[index] = { ...newItems[index], [name]: value };
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

  return (
    <AdminSection title="Projects">
      {data.projects.map((proj, index) => (
        <div key={proj.id} className="border border-border-color p-4 rounded-md mb-4">
          <InputField label="Project Name" name="name" value={proj.name} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., E-commerce Platform" error={errors[index]?.name}/>
          <TextAreaField label="Description" name="description" value={proj.description} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="A short description of your project." error={errors[index]?.description}/>
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
