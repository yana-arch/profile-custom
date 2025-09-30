import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Hobby } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import TextAreaField from '../form/TextAreaField';
import { isValidUrl } from '../../../utils/validation';
import { Bars3Icon, TrashIcon } from '../../icons/Icons';
import ConfirmationModal from '../../common/ConfirmationModal';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type HobbyErrors = Partial<Record<keyof Omit<Hobby, 'id'>, string>>;

const HobbiesSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<HobbyErrors[]>([]);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);

  const validateField = (name: string, value: string): string => {
    if (name === 'name' && !value.trim()) {
      return 'Hobby name is required.';
    }
    if ((name === 'link' || name === 'image') && value && !isValidUrl(value)) {
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
        newErrors[index][name as keyof HobbyErrors] = error;
        return newErrors;
    });
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => {
      const newItems = [...prev.hobbies];
      newItems[index] = { ...newItems[index], [name]: value };
      return { ...prev, hobbies: newItems };
    });
  };

  const addItem = () => {
    const newItem: Hobby = {id: uuidv4(), name: '', description: '', image: '', link: ''};
    setData(prev => ({
      ...prev,
      hobbies: [...prev.hobbies, newItem]
    }));
  };

  const handleRemoveClick = (index: number) => {
    setItemToDelete(index);
  };
  
  const handleConfirmRemove = () => {
    if (itemToDelete === null) return;
    setData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== itemToDelete)
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
      const newItems = [...prev.hobbies];
      const draggedItemContent = newItems.splice(dragItemIndex.current!, 1)[0];
      newItems.splice(dragOverItem, 0, draggedItemContent);
      return { ...prev, hobbies: newItems };
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
      <AdminSection title="Hobbies & Interests">
        {data.hobbies.map((hobby, index) => {
          const isDragged = draggedItem === index;
          const isDragTarget = dragOverItem === index && !isDragged;

          return (
            <div 
              key={hobby.id} 
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
                <h4 className="text-md font-semibold text-text-primary truncate pr-2">{hobby.name || 'New Hobby'}</h4>
                <Bars3Icon className="w-6 h-6 text-text-secondary flex-shrink-0"/>
              </div>
              <InputField label="Hobby Name" name="name" value={hobby.name} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Hiking" error={errors[index]?.name} />
              <TextAreaField label="Description" name="description" value={hobby.description} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Exploring national parks and mountain trails." error={errors[index]?.description} rows={2}/>
              <InputField label="Image URL" name="image" value={hobby.image || ''} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://example.com/hobby.png" error={errors[index]?.image} />
              <InputField label="Link URL (optional)" name="link" value={hobby.link || ''} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://example.com/blog-post" error={errors[index]?.link} />
              <button onClick={() => handleRemoveClick(index)} className="text-red-500 hover:text-red-700 text-sm mt-2 flex items-center gap-1">
                <TrashIcon className="w-4 h-4" />
                Remove
              </button>
            </div>
          );
        })}
        <button onClick={addItem} className="bg-primary text-white px-4 py-2 rounded-md">Add Hobby</button>
      </AdminSection>
      <ConfirmationModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmRemove}
        title="Delete Hobby"
        message="Are you sure you want to delete this hobby? This action cannot be undone."
      />
    </>
  );
};

export default HobbiesSettings;