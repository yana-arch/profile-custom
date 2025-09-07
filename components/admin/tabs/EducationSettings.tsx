import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Education } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import RichTextEditor from '../form/RichTextEditor';
import { Bars3Icon } from '../../icons/Icons';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type EducationErrors = Partial<Record<keyof Omit<Education, 'id' | 'description'>, string>>;

const EducationSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<EducationErrors[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);
  
  const validateField = (name: string, value: string): string => {
    if ((name === 'school' || name === 'degree') && !value.trim()) {
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
        newErrors[index][name as keyof EducationErrors] = error;
        return newErrors;
    });
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => {
      const newItems = [...prev.education];
      newItems[index] = { ...newItems[index], [name]: value };
      return { ...prev, education: newItems };
    });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setData(prev => {
        const newItems = [...prev.education];
        newItems[index] = { ...newItems[index], description: value };
        return { ...prev, education: newItems };
    });
  };

  const addItem = () => {
    const newItem: Education = {id: uuidv4(), school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: ''};
    setData(prev => ({
      ...prev,
      education: [...prev.education, newItem]
    }));
  };

  const removeItem = (index: number) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
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
      const newItems = [...prev.education];
      const draggedItemContent = newItems.splice(dragItemIndex.current!, 1)[0];
      newItems.splice(index, 0, draggedItemContent);
      dragItemIndex.current = index;
      return { ...prev, education: newItems };
    });
  };

  const handleDragEnd = () => {
    dragItemIndex.current = null;
    setDraggedItem(null);
  };

  return (
    <AdminSection title="Education">
      {data.education.map((edu, index) => (
        <div 
          key={edu.id} 
          className={`border border-border-color p-4 rounded-md mb-4 transition-opacity ${draggedItem === index ? 'opacity-50' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-color/50 cursor-grab active:cursor-grabbing">
            <h4 className="text-md font-semibold text-text-primary truncate pr-2">{edu.degree || 'New Education'}</h4>
            <Bars3Icon className="w-6 h-6 text-text-secondary flex-shrink-0"/>
          </div>
          <InputField label="School / University" name="school" value={edu.school} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., University of Technology" error={errors[index]?.school}/>
          <InputField label="Degree" name="degree" value={edu.degree} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Bachelor of Science" error={errors[index]?.degree}/>
          <InputField label="Field of Study" name="fieldOfStudy" value={edu.fieldOfStudy} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Computer Science" error={errors[index]?.fieldOfStudy}/>
          <InputField label="Start Date" name="startDate" value={edu.startDate} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., 2015" error={errors[index]?.startDate}/>
          <InputField label="End Date" name="endDate" value={edu.endDate} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., 2019" error={errors[index]?.endDate}/>
          <RichTextEditor 
            label="Description" 
            name={`description-${edu.id}`}
            value={edu.description} 
            onChange={value => handleDescriptionChange(index, value)}
          />
          <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 text-sm mt-2">Remove</button>
        </div>
      ))}
      <button onClick={addItem} className="bg-primary text-white px-4 py-2 rounded-md">Add Education</button>
    </AdminSection>
  );
};

export default EducationSettings;