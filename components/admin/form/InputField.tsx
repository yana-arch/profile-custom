import React from 'react';

const InputField: React.FC<{ 
  label: string; 
  value: string | number; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string; 
  type?: string;
  placeholder?: string;
  error?: string;
}> = ({ label, name, type = 'text', error, ...props }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
    <input 
      id={name} 
      name={name} 
      type={type} 
      {...props} 
      className={`w-full bg-background border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-color focus:border-primary focus:ring-primary'} rounded-md px-3 py-2 text-text-primary transition-colors`} 
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default InputField;
