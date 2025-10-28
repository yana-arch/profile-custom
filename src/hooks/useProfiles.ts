import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile';
import { queryKeys, mutationKeys } from '../lib/react-query';
import type { ProfileData } from '../../types';

// =====================================================
// QUERIES
// =====================================================

// Get user profiles with optimized caching
export const useUserProfiles = () => {
  return useQuery({
    queryKey: queryKeys.profiles.list({ isDefault: false }),
    queryFn: profileService.getUserProfiles,
    staleTime: 2 * 60 * 1000, // 2 minutes - profiles don't change often
  });
};

// Get default profile
export const useDefaultProfile = () => {
  return useQuery({
    queryKey: queryKeys.profiles.default('current'),
    queryFn: profileService.getDefaultProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes - default profile is important
  });
};

// Get profile by ID
export const useProfile = (id: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.profiles.detail(id!),
    queryFn: () => profileService.getProfileById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get public profile by slug
export const usePublicProfile = (slug: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.profiles.slug(slug!),
    queryFn: () => profileService.getPublicProfileBySlug(slug!),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // Public profiles cache longer
  });
};

// Get profile stats
export const useProfileStats = (profileId: string | undefined) => {
  return useQuery({
    queryKey: ['profile-stats', profileId],
    queryFn: () => profileService.getProfileStats(profileId!),
    enabled: !!profileId,
    staleTime: 1 * 60 * 1000, // Stats might change more frequently
  });
};

// =====================================================
// MUTATIONS
// =====================================================

// Create profile mutation
export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.profiles.create,
    mutationFn: ({
      name,
      profileData,
      templateId,
      isPublic = false,
      isDefault = false,
    }: {
      name: string;
      profileData: ProfileData;
      templateId?: string;
      isPublic?: boolean;
      isDefault?: boolean;
    }) => profileService.createProfile(name, profileData, templateId, isPublic, isDefault),
    onSuccess: () => {
      // Invalidate and refetch user profiles
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
    },
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.profiles.update,
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Parameters<typeof profileService.updateProfile>[1];
    }) => profileService.updateProfile(id, updates),
    onSuccess: (data, variables) => {
      // Update the specific profile in cache
      queryClient.setQueryData(queryKeys.profiles.detail(variables.id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.list({}) });

      // If it was a default profile update, refresh default profile
      if (variables.updates.is_default) {
        queryClient.invalidateQueries({ queryKey: queryKeys.profiles.default('current') });
      }
    },
  });
};

// Delete profile mutation
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.profiles.delete,
    mutationFn: (id: string) => profileService.deleteProfile(id),
    onSuccess: () => {
      // Invalidate profiles list
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
    },
  });
};

// Duplicate profile mutation
export const useDuplicateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['duplicate-profile'],
    mutationFn: ({ id, newName }: { id: string; newName?: string }) =>
      profileService.duplicateProfile(id, newName),
    onSuccess: () => {
      // Invalidate profiles list
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
    },
  });
};

// Create profile share mutation
export const useCreateProfileShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.profiles.share,
    mutationFn: ({ profileId, expiresAt }: { profileId: string; expiresAt?: string }) =>
      profileService.createProfileShare(profileId, expiresAt),
    onSuccess: (data, variables) => {
      // Invalidate profile stats
      queryClient.invalidateQueries({ queryKey: ['profile-stats', variables.profileId] });
    },
  });
};

// Get profile by share token
export const useProfileByShareToken = (token: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.profileShares.token(token!),
    queryFn: () => profileService.getProfileByShareToken(token!),
    enabled: !!token,
    staleTime: 10 * 60 * 1000, // Share tokens are usually single-use
  });
};
