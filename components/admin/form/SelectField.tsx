import React from 'react';

const SelectField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; name: string; children: React.ReactNode }> = ({ label, name, ...props }) => (
   <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
    <select id={name} name={name} {...props} className="w-full bg-background border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary" />
  </div>
);

export default SelectField;
