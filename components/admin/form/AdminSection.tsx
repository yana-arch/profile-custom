import React from 'react';

const AdminSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-card-background p-6 rounded-lg shadow-md mb-8">
    <h3 className="text-xl font-bold text-text-primary mb-4 border-b border-border-color pb-2">{title}</h3>
    {children}
  </div>
);

export default AdminSection;
