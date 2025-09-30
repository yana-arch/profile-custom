import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Education } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import RichTextEditor from '../form/RichTextEditor';
import { Bars3Icon, TrashIcon } from '../../icons/Icons';
import ConfirmationModal from '../../common/ConfirmationModal';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type EducationErrors = Partial<Record<keyof Omit<Education, 'id' | 'description'>, string>>;

const EducationSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<EducationErrors[]>([]);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
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

  const handleRemoveClick = (index: number) => {
    setItemToDelete(index);
  };

  const handleConfirmRemove = () => {
    if (itemToDelete === null) return;
    setData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== itemToDelete)
    }));
    setErrors(prev => prev.filter((_, i) => i !== itemToDelete));
    setItemToDelete(null);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItemIndex.current = index;
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (dragOverItem !== index) {
      setDragOverItem(index);
    }
  };

  const handleDrop = () => {
    if (dragItemIndex.current === null || dragOverItem === null || dragItemIndex.current === dragOverItem) {
      handleDragEnd();
      return;
    }

    setData(prev => {
      const newItems = [...prev.education];
      const draggedItemContent = newItems.splice(dragItemIndex.current!, 1)[0];
      newItems.splice(dragOverItem, 0, draggedItemContent);
      return { ...prev, education: newItems };
    });

    handleDragEnd();
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    dragItemIndex.current = null;
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <>
      <AdminSection title="Education">
        {data.education.map((edu, index) => {
          const isDragged = draggedItem === index;
          const isDragTarget = dragOverItem === index && !isDragged;

          return (
            <div 
              key={edu.id} 
              className={`border p-4 rounded-md mb-4 transition-all duration-200 
                ${isDragged ? 'opacity-50 ring-2 ring-primary' : 'border-border-color'}
                ${isDragTarget ? 'bg-primary/10' : ''}`}
            >
              <div 
                className="flex justify-between items-center mb-4 pb-2 border-b border-border-color/50 cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
              >
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
              <button onClick={() => handleRemoveClick(index)} className="text-red-500 hover:text-red-700 text-sm mt-2 flex items-center gap-1">
                <TrashIcon className="w-4 h-4" />
                Remove
              </button>
            </div>
          );
        })}
        <button onClick={addItem} className="bg-primary text-white px-4 py-2 rounded-md">Add Education</button>
      </AdminSection>
      <ConfirmationModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmRemove}
        title="Delete Education"
        message="Are you sure you want to delete this education entry? This action cannot be undone."
      />
    </>
  );
};

export default EducationSettings;