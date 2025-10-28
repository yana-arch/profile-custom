import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';
import type { ProfileData } from '../../types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileWithTemplate = Profile & { templates?: any };

// =====================================================
// OPTIMIZED PROFILE SERVICE
// =====================================================

export class OptimizedProfileService {
  private static instance: OptimizedProfileService;

  static getInstance(): OptimizedProfileService {
    if (!OptimizedProfileService.instance) {
      OptimizedProfileService.instance = new OptimizedProfileService();
    }
    return OptimizedProfileService.instance;
  }

  // =====================================================
  // OPTIMIZED QUERIES WITH SELECTIVE FIELDS
  // =====================================================

  /**
   * Get user profiles list (without full profile data for performance)
   * Selects only metadata fields, not the large JSONB data column
   */
  async getUserProfileList(): Promise<Array<Pick<Profile, 'id' | 'name' | 'slug' | 'is_public' | 'is_default' | 'created_at' | 'updated_at'>>> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, slug, is_public, is_default, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user profile list:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get user profiles with template info (lightweight)
   * Joins with templates but selects minimal fields
   */
  async getUserProfilesLight(): Promise<Array<Omit<ProfileWithTemplate, 'data'>>> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, user_id, name, slug, custom_css, custom_css_hash, template_id,
        is_public, is_default, view_count, created_at, updated_at,
        templates: template_id (
          id, name, preview_image, is_premium, is_featured,
          template_categories: category_id (name, icon)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user profiles light:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get profile data only (when you need the JSONB data)
   * Separated to avoid fetching large data unnecessarily
   */
  async getProfileData(id: string): Promise<Pick<Profile, 'data'> | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('data')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Profile not found
      }
      console.error('Error fetching profile data:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get full profile with data (only when needed)
   */
  async getFullProfile(id: string): Promise<ProfileWithTemplate | null> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        templates (
          id, name, description, preview_image, is_premium,
          template_categories (name, icon)
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id) // Security: ensure user owns the profile
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Profile not found
      }
      console.error('Error fetching full profile:', error);
      throw error;
    }

    return data;
  }

  // =====================================================
  // PAGINATED QUERIES
  // =====================================================

  /**
   * Get user profiles with pagination
   */
  async getUserProfilesPaginated(page = 1, limit = 10): Promise<{
    data: Array<Omit<ProfileWithTemplate, 'data'>>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const offset = (page - 1) * limit;

    // First get total count
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error fetching profile count:', countError);
      throw countError;
    }

    // Then get paginated data
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, user_id, name, slug, custom_css, custom_css_hash, template_id,
        is_public, is_default, view_count, created_at, updated_at,
        templates: template_id (
          id, name, preview_image, is_premium,
          template_categories (name)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching paginated profiles:', error);
      throw error;
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: data || [],
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  // =====================================================
  // PUBLIC PROFILE QUERIES (with caching)
  // =====================================================

  /**
   * Get public profile by slug (optimized for public access)
   * Minimal data, optimized for performance
   */
  async getPublicProfileLight(slug: string): Promise<Pick<Profile, 'id' | 'name' | 'view_count' | 'custom_css'> | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, view_count, custom_css')
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Profile not found
      }
      console.error('Error fetching public profile light:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get full public profile (only fetch data when needed)
   */
  async getFullPublicProfile(slug: string): Promise<Pick<ProfileWithTemplate, 'data' | 'templates'> | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        data,
        templates (
          id, name, description, preview_image,
          template_categories (name, icon)
        )
      `)
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Profile not found
      }
      console.error('Error fetching full public profile:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get public profiles list (for admin management)
   */
  async getPublicProfiles(limit = 50): Promise<Array<Pick<Profile, 'id' | 'name' | 'slug' | 'view_count' | 'updated_at'>>> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, slug, view_count, updated_at')
      .eq('is_public', true)
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching public profiles:', error);
      throw error;
    }

    return data || [];
  }

  // =====================================================
  // OPTIMIZED MUTATIONS
  // =====================================================

  /**
   * Create profile (optimized)
   */
  async createProfile(
    name: string,
    profileData: ProfileData,
    templateId?: string,
    isPublic: boolean = false,
    isDefault: boolean = false
  ): Promise<Pick<Profile, 'id' | 'name' | 'slug'>> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // If this is set as default, unset other default profiles
    if (isDefault) {
      await supabase.from('profiles').update({ is_default: false }).eq('user_id', user.id).eq('is_default', true);
    }

    // Generate slug using our database function
    const { data: slugData, error: slugError } = await supabase.rpc('generate_unique_slug', {
      profile_name: name,
    });

    const slug = slugData || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (slugError && slugError.message?.includes('function') === false) {
      console.warn('Slug generation warning:', slugError);
    }

    const newProfile = {
      user_id: user.id,
      name,
      slug,
      data: profileData,
      template_id: templateId || null,
      is_public: isPublic,
      is_default: isDefault,
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select('id, name, slug')
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update profile (selective updates)
   */
  async updateProfileMetadata(
    id: string,
    updates: {
      name?: string;
      is_public?: boolean;
      is_default?: boolean;
      custom_css?: string;
      custom_css_hash?: string;
      template_id?: string;
    }
  ): Promise<void> {
    // For default updates, unset other defaults first
    if (updates.is_default) {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      await supabase
        .from('profiles')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true)
        .neq('id', id);
    }

    // Update the profile metadata (note: not updating data column for performance)
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating profile metadata:', error);
      throw error;
    }
  }

  /**
   * Update profile data (only the JSONB data field)
   */
  async updateProfileData(id: string, profileData: ProfileData): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ data: profileData, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating profile data:', error);
      throw error;
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Increment view count (optimized with database function)
   */
  async incrementViewCount(profileId: string): Promise<void> {
    try {
      await supabase.rpc('increment_counter', {
        table_name: 'profiles',
        record_id: profileId,
        counter_column: 'view_count',
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // Fallback to manual update
      try {
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('view_count')
          .eq('id', profileId)
          .single();

        if (currentProfile) {
          await supabase
            .from('profiles')
            .update({ view_count: (currentProfile.view_count || 0) + 1 })
            .eq('id', profileId);
        }
      } catch (fallbackError) {
        console.error('Fallback view count increment failed:', fallbackError);
      }
    }
  }

  /**
   * Delete profile (with cascade cleanup)
   */
  async deleteProfile(id: string): Promise<void> {
    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }

  /**
   * Get profile stats (lightweight)
   */
  async getProfileStats(id: string): Promise<{
    viewCount: number;
    createdAt: string;
    updatedAt: string;
  } | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('view_count, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Profile not found
      }
      console.error('Error fetching profile stats:', error);
      throw error;
    }

    return {
      viewCount: data.view_count || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

// Export singleton instance
export const optimizedProfileService = OptimizedProfileService.getInstance();
