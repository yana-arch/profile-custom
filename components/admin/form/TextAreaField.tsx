import React from 'react';

const TextAreaField: React.FC<{ 
  label: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  name: string; 
  rows?: number;
  placeholder?: string;
  error?: string;
}> = ({ label, name, rows = 3, error, ...props }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
    <textarea 
      id={name} 
      name={name} 
      rows={rows} 
      {...props} 
      className={`w-full bg-background border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-color focus:border-primary focus:ring-primary'} rounded-md px-3 py-2 text-text-primary transition-colors`} 
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default TextAreaField;
