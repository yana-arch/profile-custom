import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Experience } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import RichTextEditor from '../form/RichTextEditor';
import { Bars3Icon } from '../../icons/Icons';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type ExperienceErrors = Partial<Record<keyof Omit<Experience, 'id' | 'skillsUsed' | 'description'>, string>>;

const ExperienceSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<ExperienceErrors[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);

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
          <RichTextEditor 
            label="Description" 
            name={`description-${exp.id}`}
            value={exp.description} 
            onChange={value => handleDescriptionChange(index, value)} 
          />
          <InputField label="Skills Used (comma-separated)" name="skillsUsed" value={exp.skillsUsed.join(', ')} onChange={e => handleSkillsChange(index, e)} placeholder="e.g., React, TypeScript, Redux" />
          <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 text-sm mt-2">Remove</button>
        </div>
      ))}
      <button onClick={addItem} className="bg-primary text-white px-4 py-2 rounded-md">Add Experience</button>
    </AdminSection>
  );
};

export default ExperienceSettings;