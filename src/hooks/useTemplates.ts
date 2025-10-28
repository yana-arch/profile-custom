import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templateService } from '../services/template';
import { queryKeys, mutationKeys } from '../lib/react-query';
import type { ProfileData } from '../../types';

// =====================================================
// QUERIES WITH PAGINATION SUPPORT
// =====================================================

// Get template categories
export const useTemplateCategories = () => {
  return useQuery({
    queryKey: queryKeys.templateCategories.all,
    queryFn: templateService.getTemplateCategories,
    staleTime: 30 * 60 * 1000, // Categories change rarely - 30 minutes
  });
};

// Get public templates with pagination
export const usePublicTemplates = (categoryId?: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: queryKeys.templates.list({ categoryId, page, limit }),
    queryFn: async () => {
      const templates = await templateService.getPublicTemplates(categoryId);

      // Manual pagination (since service doesn't support it yet)
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = templates.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        total: templates.length,
        page,
        limit,
        totalPages: Math.ceil(templates.length / limit),
        hasNextPage: endIndex < templates.length,
        hasPrevPage: page > 1,
      };
    },
    staleTime: 5 * 60 * 1000, // Templates change moderately
  });
};

// Get featured templates
export const useFeaturedTemplates = () => {
  return useQuery({
    queryKey: queryKeys.templates.list({ featured: true }),
    queryFn: templateService.getFeaturedTemplates,
    staleTime: 15 * 60 * 1000, // Featured templates cache longer
  });
};

// Get template by ID
export const useTemplate = (id: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.templates.detail(id!),
    queryFn: () => templateService.getTemplateById(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // Individual templates are stable
  });
};

// Search templates with debouncing optimization
export const useSearchTemplates = (query: string, categoryId?: string) => {
  return useQuery({
    queryKey: queryKeys.templates.search(query, categoryId),
    queryFn: () => templateService.searchTemplates(query, categoryId),
    enabled: query.length >= 2, // Only search when query is meaningful
    staleTime: 2 * 60 * 1000, // Search results can be cached briefly
    // Avoid refetching on every keystroke by using placeholder data
    placeholderData: (previousData) => previousData,
  });
};

// Get user's templates
export const useUserTemplates = () => {
  return useQuery({
    queryKey: queryKeys.templates.list({ user: 'current' }),
    queryFn: templateService.getUserTemplates,
    staleTime: 2 * 60 * 1000,
  });
};

// Get template stats
export const useTemplateStats = (templateId: string | undefined) => {
  return useQuery({
    queryKey: ['template-stats', templateId],
    queryFn: () => templateService.getTemplateStats(templateId!),
    enabled: !!templateId,
    staleTime: 1 * 60 * 1000, // Stats change more frequently
  });
};

// =====================================================
// MUTATIONS
// =====================================================

// Create template mutation
export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.templates.create,
    mutationFn: ({
      name,
      description,
      templateData,
      categoryId,
      previewImage,
    }: {
      name: string;
      description: string;
      templateData: ProfileData;
      categoryId?: string;
      previewImage?: string;
    }) => templateService.createTemplate(name, description, templateData, categoryId, previewImage),
    onSuccess: () => {
      // Invalidate template lists
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
    },
  });
};

// Update template mutation
export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.templates.update,
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Parameters<typeof templateService.updateTemplate>[1];
    }) => templateService.updateTemplate(id, updates),
    onSuccess: (data, variables) => {
      // Update the specific template in cache
      queryClient.setQueryData(queryKeys.templates.detail(variables.id), data);
      // Invalidate related lists
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
    },
  });
};

// Delete template mutation
export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.templates.delete,
    mutationFn: (id: string) => templateService.deleteTemplate(id),
    onSuccess: () => {
      // Invalidate all template queries
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
    },
  });
};

// Increment download count mutation
export const useIncrementDownload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['template-download'],
    mutationFn: (templateId: string) => templateService.incrementDownloadCount(templateId),
    onSuccess: (data, templateId) => {
      // Update the template stats in cache
      queryClient.invalidateQueries({ queryKey: ['template-stats', templateId] });
      // Optionally update the template's download count in the list cache
      queryClient.setQueriesData(
        { queryKey: queryKeys.templates.all },
        (oldData: any) => {
          if (!oldData) return oldData;
          return oldData.map((item: any) =>
            item.id === templateId ? { ...item, downloads: (item.downloads || 0) + 1 } : item
          );
        }
      );
    },
  });
};

// Rate template mutation
export const useRateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.templates.rate,
    mutationFn: ({ templateId, rating }: { templateId: string; rating: number }) =>
      templateService.rateTemplate(templateId, rating),
    onSuccess: (data, variables) => {
      // Update template stats
      queryClient.invalidateQueries({ queryKey: ['template-stats', variables.templateId] });
      // Update the template in cache if needed
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.detail(variables.templateId) });
    },
  });
};
