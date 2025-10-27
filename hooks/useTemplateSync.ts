import { useState, useCallback } from 'react';
import { templateService } from '../src/services/template';
import { ProfileData } from '../types';

export interface TemplateSyncState {
  isUploading: boolean;
  isDownloading: boolean;
  uploadProgress: number;
  downloadProgress: number;
  error: string | null;
  successMessage: string | null;
}

export const useTemplateSync = () => {
  const [syncState, setSyncState] = useState<TemplateSyncState>({
    isUploading: false,
    isDownloading: false,
    uploadProgress: 0,
    downloadProgress: 0,
    error: null,
    successMessage: null,
  });

  const clearMessages = useCallback(() => {
    setSyncState(prev => ({ ...prev, error: null, successMessage: null }));
  }, []);

  const uploadTemplate = useCallback(async (
    templateData: ProfileData,
    templateName: string,
    description?: string,
    categoryId?: string,
    previewImage?: string
  ) => {
    setSyncState(prev => ({
      ...prev,
      isUploading: true,
      error: null,
      successMessage: null,
      uploadProgress: 0
    }));

    try {
      await templateService.createTemplate(
        templateName,
        description || '',
        templateData,
        categoryId,
        previewImage
      );

      setSyncState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 100,
        successMessage: `Template "${templateName}" đã được tải lên thành công!`
      }));
    } catch (error: any) {
      setSyncState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        error: error.message || 'Lỗi tải lên template'
      }));
    }
  }, []);

  const downloadTemplate = useCallback(async (templateId: string) => {
    setSyncState(prev => ({
      ...prev,
      isDownloading: true,
      error: null,
      successMessage: null,
      downloadProgress: 0
    }));

    try {
      const template = await templateService.getTemplateById(templateId);

      if (!template) {
        throw new Error('Template không tồn tại');
      }

      // Increment download count
      await templateService.incrementDownloadCount(templateId);

      setSyncState(prev => ({
        ...prev,
        isDownloading: false,
        downloadProgress: 100,
        successMessage: `Template "${template.name}" đã được tải xuống thành công!`
      }));

      return template.data as unknown as ProfileData;
    } catch (error: any) {
      setSyncState(prev => ({
        ...prev,
        isDownloading: false,
        downloadProgress: 0,
        error: error.message || 'Lỗi tải xuống template'
      }));
      return null;
    }
  }, []);

  const uploadFromLocalStorage = useCallback(async (
    templateName: string,
    description?: string
  ) => {
    try {
      const localData = localStorage.getItem('myDynamicProfileData');
      if (!localData) {
        throw new Error('Không có dữ liệu profile trong localStorage');
      }

      const profileData = JSON.parse(localData);
      await uploadTemplate(profileData, templateName, description);
    } catch (error: any) {
      setSyncState(prev => ({
        ...prev,
        error: error.message || 'Lỗi tải dữ liệu từ localStorage'
      }));
    }
  }, [uploadTemplate]);

  const getLibraryTemplates = useCallback(async (categoryId?: string) => {
    try {
      return await templateService.getPublicTemplates(categoryId);
    } catch (error: any) {
      setSyncState(prev => ({
        ...prev,
        error: error.message || 'Lỗi tải danh sách template'
      }));
      return [];
    }
  }, []);

  const getUserTemplates = useCallback(async () => {
    try {
      return await	templateService.getUserTemplates();
    } catch (error: any) {
      setSyncState(prev => ({
        ...prev,
        error: error.message || 'Lỗi tải template của bạn'
      }));
      return [];
    }
  }, []);

  const searchTemplates = useCallback(async (query: string, categoryId?: string) => {
    try {
      return await templateService.searchTemplates(query, categoryId);
    } catch (error: any) {
      setSyncState(prev => ({
        ...prev,
        error: error.message || 'Lỗi tìm kiếm template'
      }));
      return [];
    }
  }, []);

  const rateTemplate = useCallback(async (templateId: string, rating: number) => {
    try {
      await templateService.rateTemplate(templateId, rating);
      setSyncState(prev => ({
        ...prev,
        successMessage: 'Đã đánh giá template thành công!'
      }));
    } catch (error: any) {
      setSyncState(prev => ({
        ...prev,
        error: error.message || 'Lỗi đánh giá template'
      }));
    }
  }, []);

  return {
    syncState,
    clearMessages,
    uploadTemplate,
    downloadTemplate,
    uploadFromLocalStorage,
    getLibraryTemplates,
    getUserTemplates,
    searchTemplates,
    rateTemplate,
  };
};
