import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Skill } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type SkillError = Partial<Record<keyof Skill, string>>;

const SkillsSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<Record<keyof ProfileData['skills'], SkillError[]>>({
    frontend: [], backend: [], tools: []
  });

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
            [category]: [...prev.skills[category], { id: uuidv4(), name: '', level: 50 }]
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
  
  return (
    <AdminSection title="Skills">
      {(['frontend', 'backend', 'tools'] as const).map(category => (
        <div key={category} className="mb-8">
          <h4 className="text-lg font-bold text-text-primary capitalize mb-4">{category}</h4>
          {data.skills[category].map((skill, index) => (
             <div key={skill.id} className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <InputField label="" name="name" value={skill.name} onChange={e => handleSkillChange(category, index, e)} onBlur={e => handleBlur(category, index, e)} placeholder="Skill name" error={errors[category]?.[index]?.name} />
                </div>
                <input type="range" name="level" min="0" max="100" value={skill.level} onChange={e => handleSkillChange(category, index, e)} className="flex-1" />
                <span className="w-12 text-right">{skill.level}%</span>
                <button onClick={() => removeSkill(category, index)} className="text-red-500 text-sm p-2 rounded-full hover:bg-red-500/10">X</button>
             </div>
          ))}
          <button onClick={() => addSkill(category)} className="bg-secondary/20 text-secondary px-3 py-1 text-sm rounded-md mt-2">Add {category} skill</button>
        </div>
      ))}
    </AdminSection>
  );
};

export default SkillsSettings;
