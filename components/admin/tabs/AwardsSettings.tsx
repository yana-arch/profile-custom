import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Award } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import RichTextEditor from '../form/RichTextEditor';
import { isValidUrl } from '../../../utils/validation';
import { Bars3Icon, TrashIcon } from '../../icons/Icons';
import ConfirmationModal from '../../common/ConfirmationModal';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type AwardErrors = Partial<Record<keyof Omit<Award, 'id' | 'description'>, string>>;

const AwardsSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<AwardErrors[]>([]);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);
  
  const validateField = (name: string, value: string): string => {
    if ((name === 'name' || name === 'issuer') && !value.trim()) {
      return 'This field is required.';
    }
     if (name === 'attachmentUrl' && value && !isValidUrl(value)) {
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
        newErrors[index][name as keyof AwardErrors] = error;
        return newErrors;
    });
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => {
      const newItems = [...prev.awards];
      newItems[index] = { ...newItems[index], [name]: value };
      return { ...prev, awards: newItems };
    });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setData(prev => {
        const newItems = [...prev.awards];
        newItems[index] = { ...newItems[index], description: value };
        return { ...prev, awards: newItems };
    });
  };

  const addItem = () => {
    const newItem: Award = {id: uuidv4(), name: '', issuer: '', date: '', description: '', attachmentUrl: ''};
    setData(prev => ({
      ...prev,
      awards: [...prev.awards, newItem]
    }));
  };

  const handleRemoveClick = (index: number) => {
    setItemToDelete(index);
  };
  
  const handleConfirmRemove = () => {
    if (itemToDelete === null) return;
    setData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== itemToDelete)
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
        const newItems = [...prev.awards];
        const draggedItemContent = newItems.splice(dragItemIndex.current!, 1)[0];
        newItems.splice(dragOverItem, 0, draggedItemContent);
        return { ...prev, awards: newItems };
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
      <AdminSection title="Awards & Achievements">
        {data.awards.map((award, index) => {
          const isDragged = draggedItem === index;
          const isDragTarget = dragOverItem === index && !isDragged;

          return (
            <div 
              key={award.id} 
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
                <h4 className="text-md font-semibold text-text-primary truncate pr-2">{award.name || 'New Award'}</h4>
                <Bars3Icon className="w-6 h-6 text-text-secondary flex-shrink-0"/>
              </div>
              <InputField label="Award Name" name="name" value={award.name} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Best Project Award" error={errors[index]?.name}/>
              <InputField label="Issued By" name="issuer" value={award.issuer} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., University of Technology" error={errors[index]?.issuer}/>
              <InputField label="Date" name="date" value={award.date} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., May 2023" error={errors[index]?.date}/>
              <InputField label="Attachment URL (optional)" name="attachmentUrl" value={award.attachmentUrl || ''} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://example.com/award.pdf" error={errors[index]?.attachmentUrl}/>
              <RichTextEditor 
                label="Description" 
                name={`description-${award.id}`}
                value={award.description} 
                onChange={value => handleDescriptionChange(index, value)}
              />
              <button onClick={() => handleRemoveClick(index)} className="text-red-500 hover:text-red-700 text-sm mt-2 flex items-center gap-1">
                <TrashIcon className="w-4 h-4" />
                Remove
              </button>
            </div>
          );
        })}
        <button onClick={addItem} className="bg-primary text-white px-4 py-2 rounded-md">Add Award</button>
      </AdminSection>
      <ConfirmationModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmRemove}
        title="Delete Award"
        message="Are you sure you want to delete this award? This action cannot be undone."
      />
    </>
  );
};

export default AwardsSettings;