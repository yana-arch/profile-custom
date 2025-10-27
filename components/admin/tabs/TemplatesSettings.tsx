import React, { useState, useEffect } from 'react';
import { ProfileData } from '../../../types';
import { useTemplateSync } from '../../../hooks/useTemplateSync';
import { templateService } from '../../../src/services/template';
import {
  DocumentArrowDownIcon,
  GlobeAltIcon as SearchIcon,
  TrophyIcon,
  UserIcon,
  CodeBracketIcon as CubeIcon,
  SparklesIcon,
  XMarkIcon,
  AcademicCapIcon as StarIcon,
} from '../../icons/Icons';

interface TemplatesSettingsProps {
  _data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
}

type TabType = 'browse' | 'my-templates' | 'upload';

const TemplatesSettings: React.FC<TemplatesSettingsProps> = ({ setData }) => {
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredTemplates, setFeaturedTemplates] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'recent'>('downloads');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const {
    syncState,
    clearMessages,
    downloadTemplate,
    uploadFromLocalStorage,
    getLibraryTemplates,
    getUserTemplates,
    searchTemplates,
    rateTemplate,
  } = useTemplateSync();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [activeTab, selectedCategory, sortBy]);

  const loadInitialData = async () => {
    try {
      // Load categories and featured templates once
      const [categoriesData, featuredData] = await Promise.all([
        templateService.getTemplateCategories(),
        templateService.getFeaturedTemplates()
      ]);
      setCategories(categoriesData || []);
      setFeaturedTemplates(featuredData || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      let result;
      if (activeTab === 'browse') {
        result = await getLibraryTemplates(selectedCategory || undefined);
      } else if (activeTab === 'my-templates') {
        result = await getUserTemplates();
      }

      if (result) {
        // Sort results based on sortBy
        result = sortTemplates(result);
      }

      setTemplates(result || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortTemplates = (templates: any[]) => {
    switch (sortBy) {
      case 'rating':
        return [...templates].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'recent':
        return [...templates].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'downloads':
      default:
        return [...templates].sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadTemplates();
      return;
    }
    setIsLoading(true);
    try {
      const result = await searchTemplates(query);
      setTemplates(result || []);
    } catch (error) {
      console.error('Error searching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = async (templateId: string) => {
    const downloadedData = await downloadTemplate(templateId);
    if (downloadedData) {
      setData(downloadedData);
    }
  };

  const handleRateTemplate = async (templateId: string, rating: number) => {
    await rateTemplate(templateId, rating);
    loadTemplates(); // Reload to show updated rating
  };

  const handleUploadModalSubmit = async (templateName: string, description: string) => {
    await uploadFromLocalStorage(templateName, description);
    setUploadModalOpen(false);
    if (activeTab === 'my-templates') {
      loadTemplates();
    }
  };

  const renderTemplateCard = (template: any) => {
    return (
      <div
        key={template.id}
        className="bg-card-background rounded-lg border border-border-color p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-text-secondary mt-1">{template.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-text-secondary ml-1">
                {(template.rating || 0).toFixed(1)} ({template.total_ratings || 0})
              </span>
            </div>
            <DocumentArrowDownIcon
              className="h-5 w-5 text-primary hover:text-primary/80 cursor-pointer"
              title="Download Template"
              onClick={() => handleDownloadTemplate(template.id)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center">
            <UserIcon className="h-3 w-3 mr-1" />
            {template.author_id ? 'Author' : 'Community'}
          </div>
          <div>Downloads: {template.downloads || 0}</div>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-4 w-4 cursor-pointer ${
                star <= (template.user_rating || 0) ? 'text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => handleRateTemplate(template.id, star)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Templates</h1>
          <p className="text-text-secondary">Download templates from community or upload your own</p>
        </div>
      </div>

      {/* Messages */}
      {syncState.error && (
        <div className="flex items-center p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <SparklesIcon className="h-5 w-5 mr-2" />
          {syncState.error}
          <button
            onClick={clearMessages}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {syncState.successMessage && (
        <div className="flex items-center p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <TrophyIcon className="h-5 w-5 mr-2" />
          {syncState.successMessage}
          <button
            onClick={clearMessages}
            className="ml-auto text-green-700 hover:text-green-900"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Loading States */}
      {(isLoading || syncState.isUploading || syncState.isDownloading) && (
        <div className="flex items-center p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
          {syncState.isUploading && 'Uploading template...'}
          {syncState.isDownloading && 'Downloading template...'}
          {isLoading && 'Loading templates...'}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'browse'
              ? 'bg-primary text-white'
              : 'bg-card-background text-text-secondary hover:bg-primary/10'
          }`}
        >
          Template Library
        </button>
        <button
          onClick={() => setActiveTab('my-templates')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'my-templates'
              ? 'bg-primary text-white'
              : 'bg-card-background text-text-secondary hover:bg-primary/10'
          }`}
        >
          My Templates
        </button>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2 rounded-md font-medium bg-secondary text-white hover:bg-secondary/90 transition-colors"
        >
          Upload Template
        </button>
      </div>

      {/* Filters and Search */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-border-color rounded-md bg-card-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-primary">Category:</label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-3 py-1 border border-border-color rounded-md bg-card-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-primary">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'downloads' | 'rating' | 'recent')}
                className="px-3 py-1 border border-border-color rounded-md bg-card-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="downloads">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedCategory || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="px-3 py-1 text-sm text-text-secondary hover:text-text-primary underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Featured Templates */}
      {activeTab === 'browse' && featuredTemplates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-yellow-400" />
            Featured Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTemplates.slice(0, 3).map(featuredTemplate => (
              <div
                key={`featured-${featuredTemplate.id}`}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-2 border-yellow-300 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary flex items-center">
                      <TrophyIcon className="h-4 w-4 mr-2 text-yellow-500" />
                      {featuredTemplate.name}
                    </h3>
                    {featuredTemplate.description && (
                      <p className="text-sm text-text-secondary mt-1">{featuredTemplate.description}</p>
                    )}
                  </div>
                  <DocumentArrowDownIcon
                    className="h-5 w-5 text-primary hover:text-primary/80 cursor-pointer ml-4"
                    title="Download Template"
                    onClick={() => handleDownloadTemplate(featuredTemplate.id)}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span className="flex items-center">
                    <StarIcon className="h-3 w-3 mr-1 text-yellow-400" />
                    {(featuredTemplate.rating || 0).toFixed(1)}
                  </span>
                  <span>{featuredTemplate.downloads || 0} downloads</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(renderTemplateCard)}
      </div>

      {templates.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <CubeIcon className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No templates found</h3>
          <p className="text-text-secondary">
            {activeTab === 'browse'
              ? 'Be the first to contribute templates to the community!'
              : 'Upload your first template to get started.'
            }
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} onSubmit={handleUploadModalSubmit} />}
    </div>
  );
};

const UploadModal: React.FC<{ onClose: () => void; onSubmit: (name: string, description: string) => void }> = ({
  onClose,
  onSubmit,
}) => {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (templateName.trim()) {
      onSubmit(templateName.trim(), description.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card-background rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border-color">
          <h2 className="text-xl font-semibold text-text-primary">Upload Template</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="templateName" className="block text-sm font-medium text-text-primary mb-2">
              Template Name *
            </label>
            <input
              type="text"
              id="templateName"
              name="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-border-color rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter template name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-border-color rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe your template"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              disabled={!templateName.trim()}
            >
              Upload Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplatesSettings;
