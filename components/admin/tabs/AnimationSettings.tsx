import React from 'react';
import { ProfileData } from '../../../types';
import AdminSection from '../form/AdminSection';
import SelectField from '../form/SelectField';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

const AnimationSettings: React.FC<Props> = ({ data, setData }) => {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
        ...prev,
        settings: {
            ...prev.settings,
            animations: {
                ...prev.settings.animations,
                [name]: value
            }
        }
    }));
  };

  return (
    <AdminSection title="Animations & Effects">
        <p className="text-text-secondary text-sm mb-6">
            Customize the visual effects and animations across your profile. Disabling animations can improve performance on older devices.
        </p>
        
        <SelectField 
            label="On-Scroll Animation" 
            name="scrollAnimation" 
            value={data.settings.animations.scrollAnimation} 
            onChange={handleChange}
        >
            <option value="none">None</option>
            <option value="fadeIn">Fade In</option>
            <option value="slideUp">Slide Up</option>
        </SelectField>

        <SelectField 
            label="Card Hover Effect" 
            name="hoverEffect" 
            value={data.settings.animations.hoverEffect} 
            onChange={handleChange}
        >
            <option value="none">None</option>
            <option value="lift">Lift & Shadow</option>
            <option value="grow">Grow</option>
        </SelectField>

    </AdminSection>
  );
};

export default AnimationSettings;
