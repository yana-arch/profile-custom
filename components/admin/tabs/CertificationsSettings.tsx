import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileData, Certification } from '../../../types';
import AdminSection from '../form/AdminSection';
import InputField from '../form/InputField';
import { isValidUrl } from '../../../utils/validation';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type CertificationErrors = Partial<Record<keyof Omit<Certification, 'id'>, string>>;

const CertificationsSettings: React.FC<Props> = ({ data, setData }) => {
  const [errors, setErrors] = useState<CertificationErrors[]>([]);

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

  const removeItem = (index: number) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
    setErrors(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <AdminSection title="Certifications & Awards">
      {data.certifications.map((cert, index) => (
        <div key={cert.id} className="border border-border-color p-4 rounded-md mb-4">
          <InputField label="Certificate Name" name="name" value={cert.name} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., AWS Certified Cloud Practitioner" error={errors[index]?.name} />
          <InputField label="Issuing Organization" name="issuingOrganization" value={cert.issuingOrganization} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., Amazon Web Services" error={errors[index]?.issuingOrganization} />
          <InputField label="Date Issued" name="date" value={cert.date} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="e.g., 2022" error={errors[index]?.date} />
          <InputField label="Credential URL" name="credentialUrl" value={cert.credentialUrl} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://www.credly.com/your-badge" error={errors[index]?.credentialUrl} />
          <InputField label="Image URL" name="image" value={cert.image || ''} onChange={e => handleItemChange(index, e)} onBlur={e => handleBlur(index, e)} placeholder="https://example.com/certificate.png" error={errors[index]?.image} />
          <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
        </div>
      ))}
      <button onClick={addItem} className="bg-primary text-white px-4 py-2 rounded-md">Add Certification</button>
    </AdminSection>
  );
};

export default CertificationsSettings;
