import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Skill } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import { Bars3Icon } from '../../icons/Icons';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type SkillError = Partial<Record<keyof Skill, string>>;

const SkillsSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<Record<keyof ProfileData['skills'], SkillError[]>>({
    frontend: [], backend: [], tools: []
  });
  const [draggedItem, setDraggedItem] = useState<{ category: keyof ProfileData['skills']; index: number } | null>(null);
  const dragItemInfo = useRef<{ category: keyof ProfileData['skills']; index: number } | null>(null);

  const validateField = (value: string): string => {
    if (!value.trim()) {
      return 'Skill name is required.';
    }
    return '';
  };

  const handleBlur = (category: keyof ProfileData['skills'], index: number, e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const error = validateField(value);
      setErrors(prev => {
        const categoryErrors = [...(prev[category] || [])];
        if (!categoryErrors[index]) categoryErrors[index] = {};
        categoryErrors[index].name = error;
        return { ...prev, [category]: categoryErrors };
      });
    }
  };

  const handleSkillChange = (category: keyof ProfileData['skills'], index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => {
      const updatedSkills = [...prev.skills[category]];
      updatedSkills[index] = { ...updatedSkills[index], [name]: name === 'level' ? parseInt(value, 10) : value };
      return { ...prev, skills: { ...prev.skills, [category]: updatedSkills }};
    });
  };

  const addSkill = (category: keyof ProfileData['skills']) => {
    setData(prev => ({
        ...prev,
        skills: {
            ...prev.skills,
            [category]: [...prev.skills[category], { id: uuidv4(), name: '', level: 50, icon: '' }]
        }
    }));
  };

  const removeSkill = (category: keyof ProfileData['skills'], index: number) => {
    setData(prev => {
        const newSkills = { ...prev.skills };
        newSkills[category] = newSkills[category].filter((_, i) => i !== index);
        return { ...prev, skills: newSkills };
    });
    setErrors(prev => {
        const categoryErrors = [...(prev[category] || [])];
        categoryErrors.splice(index, 1);
        return { ...prev, [category]: categoryErrors };
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, category: keyof ProfileData['skills'], index: number) => {
    dragItemInfo.current = { category, index };
    setDraggedItem({ category, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (category: keyof ProfileData['skills'], index: number) => {
      if (!dragItemInfo.current || dragItemInfo.current.category !== category || dragItemInfo.current.index === index) {
          return;
      }

      setData(prev => {
          const newSkills = { ...prev.skills };
          const items = [...newSkills[category]];
          const draggedItemContent = items.splice(dragItemInfo.current!.index, 1)[0];
          items.splice(index, 0, draggedItemContent);
          dragItemInfo.current!.index = index;
          newSkills[category] = items;
          return { ...prev, skills: newSkills };
      });
  };

  const handleDragEnd = () => {
      dragItemInfo.current = null;
      setDraggedItem(null);
  };
  
  return (
    <AdminSection title="Skills">
      {(['frontend', 'backend', 'tools'] as const).map(category => (
        <div key={category} className="mb-8">
          <h4 className="text-lg font-bold text-text-primary capitalize mb-4">{category}</h4>
          {data.skills[category].map((skill, index) => (
             <div 
                key={skill.id} 
                className={`border border-border-color p-4 rounded-md mb-4 transition-opacity ${draggedItem?.category === category && draggedItem?.index === index ? 'opacity-50' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, category, index)}
                onDragEnter={() => handleDragEnter(category, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-color/50 cursor-grab active:cursor-grabbing">
                  <h4 className="text-md font-semibold text-text-primary truncate pr-2">{skill.name || 'New Skill'}</h4>
                  <div className="flex items-center">
                    <button onClick={() => removeSkill(category, index)} className="text-red-500 hover:text-red-700 text-sm mr-2">Remove</button>
                    <Bars3Icon className="w-6 h-6 text-text-secondary flex-shrink-0"/>
                  </div>
                </div>

                <InputField label="Skill Name" name="name" value={skill.name} onChange={e => handleSkillChange(category, index, e)} onBlur={e => handleBlur(category, index, e)} placeholder="e.g., React" error={errors[category]?.[index]?.name} />
                <InputField label="Icon Name (optional)" name="icon" value={skill.icon || ''} onChange={e => handleSkillChange(category, index, e)} placeholder="e.g., react, vue, nodejs" />
                <label className="block text-sm font-medium text-text-secondary mb-1">Proficiency Level: {skill.level}%</label>
                <input type="range" name="level" min="0" max="100" value={skill.level} onChange={e => handleSkillChange(category, index, e)} className="w-full" />
             </div>
          ))}
          <button onClick={() => addSkill(category)} className="bg-secondary/20 text-secondary px-3 py-1 text-sm rounded-md mt-2">Add {category} skill</button>
        </div>
      ))}
    </AdminSection>
  );
};

export default SkillsSettings;