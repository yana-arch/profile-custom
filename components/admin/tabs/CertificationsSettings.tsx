import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Certification } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import { isValidUrl } from '../../../utils/validation';
import { Bars3Icon, TrashIcon } from '../../icons/Icons';
import ConfirmationModal from '../../common/ConfirmationModal';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type CertificationErrors = Partial<Record<keyof Omit<Certification, 'id'>, string>>;

const CertificationsSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<CertificationErrors[]>([]);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);

  const validateField = (name: string, value: string): string => {
    if (name === 'name' && !value.trim()) {
      return 'Certificate name is required.';
    }
    if ((name === 'credentialUrl' || name === 'image') && value && !isValidUrl(value)) {
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
        newErrors[index][name as keyof CertificationErrors] = error;
        return newErrors;
    });
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => {
      const newItems = [...prev.certifications];
      newItems[index] = { ...newItems[index], [name]: value };
      return { ...prev, certifications: newItems };
    });
  };

  const addItem = () => {
    const newItem: Certification = {id: uuidv4(), name: '', issuingOrganization: '', date: '', credentialUrl: '', image: ''};
    setData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newItem]
    }));
  };

  const handleRemoveClick = (index: number) => {
    setItemToDelete(index);
  };

  const handleConfirmRemove = () => {
    if (itemToDelete === null) return;
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== itemToDelete)
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
      const newItems = [...prev.certifications];
      const draggedItemContent = newItems.splice(dragItemIndex.current!, 1)[0];
      newItems.splice(dragOverItem, 0, draggedItemContent);
      return { ...prev, certifications: newItems };
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
      <AdminSection title="Certifications">
        {data.certifications.map((cert, index) => {
          const isDragged = draggedItem === index;
          const isDragTarget = dragOverItem === index && !isDragged;

          return (
            <div 
              key={cert.id} 
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
                <h4 className="text-md font-semibold text-text-primary truncate pr-2">{cert.name || 'New Certification'}</h4>
                <Bars3Icon className="w-6 h-6 text-text-secondary flex-shrink-0"/>
              </div>
              <InputField label="Certificate Name" name="name" value={cert.name} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., AWS Certified Cloud Practitioner" error={errors[index]?.name} />
              <InputField label="Issuing Organization" name="issuingOrganization" value={cert.issuingOrganization} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Amazon Web Services" error={errors[index]?.issuingOrganization} />
              <InputField label="Date Issued" name="date" value={cert.date} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., 2022" error={errors[index]?.date} />
              <InputField label="Credential URL" name="credentialUrl" value={cert.credentialUrl} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://www.credly.com/your-badge" error={errors[index]?.credentialUrl} />
              <InputField label="Image URL" name="image" value={cert.image || ''} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://example.com/certificate.png" error={errors[index]?.image} />
              <button onClick={() => handleRemoveClick(index)} className="text-red-500 hover:text-red-700 text-sm mt-2 flex items-center gap-1">
                <TrashIcon className="w-4 h-4" />
                Remove
              </button>
            </div>
          );
        })}
        <button onClick={addItem} className="bg-primary text-white px-4 py-2 rounded-md">Add Certification</button>
      </AdminSection>
      <ConfirmationModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmRemove}
        title="Delete Certification"
        message="Are you sure you want to delete this certification? This action cannot be undone."
      />
    </>
  );
};

export default CertificationsSettings;