import React from 'react';
import ReactQuill from 'react-quill';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ label, value, onChange, name }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <div className="mb-4 rich-text-editor">
      <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder="Describe your responsibilities and achievements..."
      />
    </div>
  );
};

export default RichTextEditor;