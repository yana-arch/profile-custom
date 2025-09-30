import { supabase } from '../lib/supabase'
import type { ProfileData } from '../../types'

// Simplified types for template management
interface Template {
  id: string
  name: string
  description?: string | null
  preview_image?: string | null
  data: any
  author_id?: string | null
  category_id?: string | null
  is_premium: boolean
  is_featured: boolean
  downloads: number
  rating: number
  total_ratings: number
  created_at: string
  updated_at: string
}

interface TemplateCategory {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  sort_order: number
  created_at: string
}

export class TemplateService {
  private static instance: TemplateService

  static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService()
    }
    return TemplateService.instance
  }

  // Get all template categories
  async getTemplateCategories(): Promise<TemplateCategory[]> {
    const { data, error } = await supabase
      .from('template_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching template categories:', error)
      throw error
    }

    return data || []
  }

  // Get all public templates
  async getPublicTemplates(categoryId?: string): Promise<Template[]> {
    let query = supabase
      .from('templates')
      .select(`
        *,
        template_categories (*)
      `)
      .order('downloads', { ascending: false })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching public templates:', error)
      throw error
    }

    return data || []
  }

  // Get featured templates
  async getFeaturedTemplates(): Promise<Template[]> {
    const { data, error } = await supabase
      .from('templates')
      .select(`
        *,
        template_categories (*)
      `)
      .eq('is_featured', true)
      .order('downloads', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Error fetching featured templates:', error)
      throw error
    }

    return data || []
  }

  // Get template by ID
  async getTemplateById(id: string): Promise<Template | null> {
    const { data, error } = await supabase
      .from('templates')
      .select(`
        *,
        template_categories (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Template not found
      }
      console.error('Error fetching template:', error)
      throw error
    }

    return data
  }

  // Create new template (for authenticated users)
  async createTemplate(
    name: string,
    description: string,
    templateData: ProfileData,
    categoryId?: string,
    previewImage?: string
  ): Promise<Template> {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    const newTemplate = {
      name,
      description,
      data: templateData,
      author_id: user.id,
      category_id: categoryId || null,
      preview_image: previewImage || null,
      is_premium: false,
      is_featured: false,
      downloads: 0,
      rating: 0,
      total_ratings: 0
    }

    const { data, error } = await supabase
      .from('templates')
      .insert(newTemplate)
      .select()
      .single()

    if (error) {
      console.error('Error creating template:', error)
      throw error
    }

    return data as Template
  }

  // Update template (only by author)
  async updateTemplate(
    id: string,
    updates: {
      name?: string
      description?: string
      data?: ProfileData
      category_id?: string
      preview_image?: string
    }
  ): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating template:', error)
      throw error
    }

    return data as Template
  }

  // Delete template (only by author)
  async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting template:', error)
      throw error
    }
  }

  // Increment download count
  async incrementDownloadCount(templateId: string): Promise<void> {
    try {
      // Get current download count
      const { data: template } = await supabase
        .from('templates')
        .select('downloads')
        .eq('id', templateId)
        .single()

      if (template) {
        // Update download count
        await supabase
          .from('templates')
          .update({ downloads: (template.downloads || 0) + 1 })
          .eq('id', templateId)
      }
    } catch (error) {
      console.error('Error incrementing download count:', error)
    }
  }

  // Rate template
  async rateTemplate(templateId: string, rating: number): Promise<void> {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    // For simplicity, we'll just update the overall rating
    // In a real app, you'd want to store individual ratings
    try {
      const { data: template } = await supabase
        .from('templates')
        .select('rating, total_ratings')
        .eq('id', templateId)
        .single()

      if (template) {
        const currentTotal = (template.rating || 0) * (template.total_ratings || 0)
        const newTotal = currentTotal + rating
        const newCount = (template.total_ratings || 0) + 1
        const newRating = newTotal / newCount

        await supabase
          .from('templates')
          .update({
            rating: newRating,
            total_ratings: newCount
          })
          .eq('id', templateId)
      }
    } catch (error) {
      console.error('Error rating template:', error)
      throw error
    }
  }

  // Search templates
  async searchTemplates(query: string, categoryId?: string): Promise<Template[]> {
    let searchQuery = supabase
      .from('templates')
      .select(`
        *,
        template_categories (*)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('downloads', { ascending: false })

    if (categoryId) {
      searchQuery = searchQuery.eq('category_id', categoryId)
    }

    const { data, error } = await searchQuery

    if (error) {
      console.error('Error searching templates:', error)
      throw error
    }

    return data || []
  }

  // Get user's templates
  async getUserTemplates(): Promise<Template[]> {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('templates')
      .select(`
        *,
        template_categories (*)
      `)
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user templates:', error)
      throw error
    }

    return data || []
  }

  // Get template statistics
  async getTemplateStats(templateId: string): Promise<{
    downloads: number
    rating: number
    totalRatings: number
    createdAt: string
  }> {
    const { data, error } = await supabase
      .from('templates')
      .select('downloads, rating, total_ratings, created_at')
      .eq('id', templateId)
      .single()

    if (error) {
      console.error('Error fetching template stats:', error)
      throw error
    }

    return {
      downloads: data.downloads || 0,
      rating: data.rating || 0,
      totalRatings: data.total_ratings || 0,
      createdAt: data.created_at
    }
  }
}

// Export singleton instance
export const templateService = TemplateService.getInstance()
