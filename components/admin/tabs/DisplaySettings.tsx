import React, { useRef } from 'react';
import { ProfileData } from '../../../types';
import AdminSection from '../form/AdminSection';
import SelectField from '../form/SelectField';
import TextAreaField from '../form/TextAreaField';

type Props = {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

const DisplaySettings: React.FC<Props> = ({ data, setData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('section_')) {
      const isChecked = (e.target as HTMLInputElement).checked;
      const sectionName = name.split('_')[1];
      setData(prev => ({
          ...prev,
          settings: { ...prev.settings, sections: { ...prev.settings.sections, [sectionName]: isChecked } }
      }));
    } else {
        setData(prev => ({
          ...prev,
          settings: { ...prev.settings, [name]: value }
        }));
    }
  };

  const handleExport = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'myDynamicProfile.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const importedData = JSON.parse(text);
            setData(importedData);
            alert('Data imported successfully!');
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Failed to import data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <AdminSection title="Display Settings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
              <h4 className="font-semibold text-text-primary mb-2">Layout Options</h4>
              <div className="flex space-x-4">
                  {['scroll', 'tab', 'slide'].map(layout => (
                      <label key={layout} className="flex items-center">
                          <input type="radio" name="layout" value={layout} checked={data.settings.layout === layout} onChange={handleSettingsChange} className="form-radio text-primary" />
                          <span className="ml-2 capitalize text-text-secondary">{layout}</span>
                      </label>
                  ))}
              </div>
          </div>
          <div>
              <h4 className="font-semibold text-text-primary mb-2">Theme</h4>
              <div className="flex space-x-4">
                  {['light', 'dark'].map(theme => (
                      <label key={theme} className="flex items-center">
                          <input type="radio" name="theme" value={theme} checked={data.settings.theme === theme} onChange={handleSettingsChange} className="form-radio text-primary" />
                          <span className="ml-2 capitalize text-text-secondary">{theme}</span>
                      </label>
                  ))}
              </div>
          </div>
          <div className="flex items-center space-x-4">
              <label htmlFor="primaryColor" className="font-semibold text-text-primary">Primary Color</label>
              <input type="color" name="primaryColor" id="primaryColor" value={data.settings.primaryColor} onChange={handleSettingsChange} className="w-10 h-10 rounded" />
          </div>
           <div className="flex items-center space-x-4">
              <label htmlFor="secondaryColor" className="font-semibold text-text-primary">Secondary Color</label>
              <input type="color" name="secondaryColor" id="secondaryColor" value={data.settings.secondaryColor} onChange={handleSettingsChange} className="w-10 h-10 rounded" />
          </div>
          <div className="col-span-1 md:col-span-2">
             <SelectField label="Font Family" name="fontFamily" value={data.settings.fontFamily} onChange={handleSettingsChange}>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                  <option>Lato</option>
                  <option>Montserrat</option>
             </SelectField>
          </div>
           <div className="col-span-1 md:col-span-2">
              <h4 className="font-semibold text-text-primary mb-2">Sections Visibility</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.keys(data.settings.sections).map(sectionKey => (
                      <label key={sectionKey} className="flex items-center">
                          <input type="checkbox" name={`section_${sectionKey}`} checked={data.settings.sections[sectionKey as keyof typeof data.settings.sections]} onChange={handleSettingsChange} className="form-checkbox text-primary rounded" />
                          <span className="ml-2 capitalize text-text-secondary">{sectionKey}</span>
                      </label>
                  ))}
              </div>
           </div>
      </div>
      <div className="mt-6">
          <TextAreaField label="Advanced Custom CSS" name="customCss" value={data.settings.customCss} onChange={handleSettingsChange} rows={10} />
      </div>
      <div className="mt-8 border-t border-border-color pt-6">
           <h4 className="font-semibold text-text-primary mb-4">Data Management</h4>
           <div className="flex space-x-4">
              <button onClick={handleExport} className="bg-secondary/80 text-white px-4 py-2 rounded-md hover:bg-secondary">Export Data</button>
              <button onClick={handleImportClick} className="bg-border-color text-text-secondary px-4 py-2 rounded-md hover:bg-primary/20">Import Data</button>
              <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
           </div>
      </div>
    </AdminSection>
  );
};

export default DisplaySettings;
