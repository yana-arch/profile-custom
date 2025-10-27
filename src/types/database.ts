// Auto-generated database types based on our schema
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      css_validations: {
        Row: {
          id: string;
          profile_id: string;
          css_content: string;
          is_valid: boolean;
          errors: Json | null;
          validated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          css_content: string;
          is_valid?: boolean;
          errors?: Json | null;
          validated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          css_content?: string;
          is_valid?: boolean;
          errors?: Json | null;
          validated_at?: string;
        };
      };
      profile_shares: {
        Row: {
          id: string;
          profile_id: string;
          share_token: string;
          expires_at: string | null;
          view_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          share_token: string;
          expires_at?: string | null;
          view_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          share_token?: string;
          expires_at?: string | null;
          view_count?: number;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string | null;
          data: Json;
          custom_css: string | null;
          custom_css_hash: string | null;
          template_id: string | null;
          is_public: boolean;
          is_default: boolean;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug?: string | null;
          data: Json;
          custom_css?: string | null;
          custom_css_hash?: string | null;
          template_id?: string | null;
          is_public?: boolean;
          is_default?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string | null;
          data?: Json;
          custom_css?: string | null;
          custom_css_hash?: string | null;
          template_id?: string | null;
          is_public?: boolean;
          is_default?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      template_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          preview_image: string | null;
          data: Json;
          author_id: string | null;
          category_id: string | null;
          is_premium: boolean;
          is_featured: boolean;
          downloads: number;
          rating: number;
          total_ratings: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          preview_image?: string | null;
          data: Json;
          author_id?: string | null;
          category_id?: string | null;
          is_premium?: boolean;
          is_featured?: boolean;
          downloads?: number;
          rating?: number;
          total_ratings?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          preview_image?: string | null;
          data?: Json;
          author_id?: string | null;
          category_id?: string | null;
          is_premium?: boolean;
          is_featured?: boolean;
          downloads?: number;
          rating?: number;
          total_ratings?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_token: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_token: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_token?: string;
          expires_at?: string;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          last_login: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          is_active?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_share_token: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      generate_unique_slug: {
        Args: {
          profile_name: string;
        };
        Returns: string;
      };
      update_updated_at_column: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
