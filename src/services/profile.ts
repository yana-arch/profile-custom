import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'
import type { ProfileData } from '../../types'

type Profile = Database['public']['Tables']['profiles']['Row']

export interface ProfileWithTemplate extends Profile {
  templates?: any
}

export class ProfileService {
  private static instance: ProfileService

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService()
    }
    return ProfileService.instance
  }

  // Get all profiles for current user
  async getUserProfiles(): Promise<ProfileWithTemplate[]> {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        templates (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching profiles:', error)
      throw error
    }

    return data || []
  }

  // Get default profile for current user
  async getDefaultProfile(): Promise<ProfileWithTemplate | null> {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        templates (*)
      `)
      .eq('user_id', user.id)
      .eq('is_default', true)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching default profile:', error)
      throw error
    }

    return data
  }

  // Get profile by ID
  async getProfileById(id: string): Promise<ProfileWithTemplate | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        templates (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Profile not found
      }
      console.error('Error fetching profile:', error)
      throw error
    }

    return data
  }

  // Get public profile by slug
  async getPublicProfileBySlug(slug: string): Promise<ProfileWithTemplate | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        templates (*)
      `)
      .eq('slug', slug)
      .eq('is_public', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Profile not found
      }
      console.error('Error fetching public profile:', error)
      throw error
    }

    // Increment view count
    if (data) {
      await this.incrementViewCount(data.id)
    }

    return data
  }

  // Create new profile
  async createProfile(
    name: string,
    profileData: ProfileData,
    templateId?: string,
    isPublic: boolean = false,
    isDefault: boolean = false
  ): Promise<Profile> {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    // If this is set as default, unset other default profiles
    if (isDefault) {
      await supabase
        .from('profiles')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true)
    }

    // Generate slug from profile name
    const slug = this.generateSimpleSlug(name)

    const newProfile = {
      user_id: user.id,
      name,
      slug,
      data: profileData,
      template_id: templateId || null,
      is_public: isPublic,
      is_default: isDefault
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      throw error
    }

    return data as Profile
  }

  // Update profile
  async updateProfile(
    id: string,
    updates: {
      name?: string
      data?: ProfileData
      custom_css?: string
      custom_css_hash?: string
      template_id?: string
      is_public?: boolean
      is_default?: boolean
      slug?: string | null
    }
  ): Promise<Profile> {
    // If this is set as default, unset other default profiles
    if (updates.is_default) {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('User not authenticated')
      }

      await supabase
        .from('profiles')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true)
        .neq('id', id) // Don't unset the current profile
    }

    // Generate new slug if name is being updated
    if (updates.name) {
      updates.slug = await this.generateSlug(updates.name)
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }

    return data
  }

  // Delete profile
  async deleteProfile(id: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting profile:', error)
      throw error
    }
  }

  // Duplicate profile
  async duplicateProfile(id: string, newName?: string): Promise<Profile> {
    const profile = await this.getProfileById(id)

    if (!profile) {
      throw new Error('Profile not found')
    }

    const duplicatedData = JSON.parse(JSON.stringify(profile.data)) // Deep clone

    return this.createProfile(
      newName || `${profile.name} (Copy)`,
      duplicatedData,
      profile.template_id || undefined,
      false, // Don't copy public status
      false  // Don't copy default status
    )
  }

  // Simple slug generation method
  private generateSimpleSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Generate unique slug for profile
  private async generateSlug(name: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('generate_unique_slug', {
        profile_name: name
      })

      if (error) {
        console.error('Error generating slug:', error)
        // Fallback to simple slug generation
        return name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }

      return data
    } catch (error) {
      console.error('Error calling generate_unique_slug:', error)
      // Fallback to simple slug generation
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
  }

  // Increment view count for profile
  private async incrementViewCount(profileId: string): Promise<void> {
    try {
      // Simple increment without SQL functions for now
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('view_count')
        .eq('id', profileId)
        .single()

      if (currentProfile) {
        await supabase
          .from('profiles')
          .update({ view_count: (currentProfile.view_count || 0) + 1 })
          .eq('id', profileId)
      }
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  // Get profile statistics
  async getProfileStats(profileId: string): Promise<{
    viewCount: number
    shareCount: number
    createdAt: string
    updatedAt: string
  }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('view_count, created_at, updated_at')
      .eq('id', profileId)
      .single()

    if (error) {
      console.error('Error fetching profile stats:', error)
      throw error
    }

    if (!data) {
      throw new Error('Profile not found')
    }

    // Get share count
    const { count: shareCount, error: shareError } = await supabase
      .from('profile_shares')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId)

    if (shareError) {
      console.error('Error fetching share count:', shareError)
    }

    return {
      viewCount: data.view_count,
      shareCount: shareCount || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }

  // Create profile share link
  async createProfileShare(
    profileId: string,
    expiresAt?: string
  ): Promise<{ share_token: string }> {
    // Generate share token using RPC function
    const { data: shareToken, error: tokenError } = await supabase.rpc('generate_share_token')

    if (tokenError) {
      console.error('Error generating share token:', tokenError)
      throw tokenError
    }

    // Create share record
    const { data, error } = await supabase
      .from('profile_shares')
      .insert({
        profile_id: profileId,
        share_token: shareToken,
        expires_at: expiresAt || null
      })
      .select('share_token')
      .single()

    if (error) {
      console.error('Error creating profile share:', error)
      throw error
    }

    return data
  }

  // Get profile by share token
  async getProfileByShareToken(token: string): Promise<ProfileWithTemplate | null> {
    const { data: share, error: shareError } = await supabase
      .from('profile_shares')
      .select('profile_id, expires_at')
      .eq('share_token', token)
      .single()

    if (shareError) {
      if (shareError.code === 'PGRST116') {
        return null // Share not found
      }
      throw shareError
    }

    if (!share) {
      return null
    }

    // Check if share has expired
    if (share.expires_at && new Date(share.expires_at) < new Date()) {
      return null // Share expired
    }

    // Get the profile
    return this.getProfileById(share.profile_id)
  }
}

// Export singleton instance
export const profileService = ProfileService.getInstance()
