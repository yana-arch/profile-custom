import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Education } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import TextAreaField from '../form/TextAreaField';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type EducationErrors = Partial<Record<keyof Omit<Education, 'id'>, string>>;

const EducationSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<EducationErrors[]>([]);
  
  const validateField = (name: string, value: string): string => {
    if ((name === 'school' || name === 'degree') && !value.trim()) {
      return 'This field is required.';
    }
    return '';
  };
  
  const handleBlur = (index: number, e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => {
        const newErrors = [...prev];
        if (!newErrors[index]) newErrors[index] = {};
        newErrors[index][name as keyof EducationErrors] = error;
        return newErrors;
    });
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => {
      const newItems = [...prev.education];
      newItems[index] = { ...newItems[index], [name]: value };
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

  return (
    <AdminSection title="Education">
      {data.education.map((edu, index) => (
        <div key={edu.id} className="border border-border-color p-4 rounded-md mb-4">
          <InputField label="School / University" name="school" value={edu.school} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., University of Technology" error={errors[index]?.school}/>
          <InputField label="Degree" name="degree" value={edu.degree} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Bachelor of Science" error={errors[index]?.degree}/>
          <InputField label="Field of Study" name="fieldOfStudy" value={edu.fieldOfStudy} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Computer Science" error={errors[index]?.fieldOfStudy}/>
          <InputField label="Start Date" name="startDate" value={edu.startDate} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., 2015" error={errors[index]?.startDate}/>
          <InputField label="End Date" name="endDate" value={edu.endDate} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., 2019" error={errors[index]?.endDate}/>
          <TextAreaField label="Description" name="description" value={edu.description} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Graduated with honors, member of coding club." error={errors[index]?.description}/>
          <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
        </div>
      ))}
      <button onClick={addItem} className="bg-primary text-white px-4 py-2 rounded-md">Add Education</button>
    </AdminSection>
  );
};

export default EducationSettings;
