import { supabase, getCurrentUser, signOut as supabaseSignOut } from '../lib/supabase'
import type { User, AuthError } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  loading: boolean
  error: AuthError | null
}

export class AuthService {
  private static instance: AuthService
  private authState: AuthState = {
    user: null,
    loading: true,
    error: null
  }

  private listeners: ((state: AuthState) => void)[] = []

  private constructor() {
    this.initializeAuth()
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  private async initializeAuth() {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        this.updateState({ error, loading: false })
        return
      }

      if (session?.user) {
        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', session.user.id)

        this.updateState({ user: session.user, loading: false })
      } else {
        this.updateState({ loading: false })
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Update last login
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', session.user.id)

          this.updateState({ user: session.user, loading: false, error: null })
        } else if (event === 'SIGNED_OUT') {
          this.updateState({ user: null, loading: false, error: null })
        }
      })
    } catch (error) {
      this.updateState({ error: error as AuthError, loading: false })
    }
  }

  private updateState(newState: Partial<AuthState>) {
    this.authState = { ...this.authState, ...newState }
    this.listeners.forEach(listener => listener(this.authState))
  }

  // Subscribe to auth state changes
  onAuthStateChange(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    // Immediately call with current state
    listener(this.authState)

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Get current auth state
  getAuthState(): AuthState {
    return this.authState
  }

  // Sign up with email and password
  async signUp(email: string, password: string, fullName?: string) {
    this.updateState({ loading: true, error: null })

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) {
        this.updateState({ error, loading: false })
        throw error
      }

      // If user is created immediately (no email confirmation required)
      if (data.user && !data.user.email_confirmed_at) {
        this.updateState({ user: data.user, loading: false })
      } else {
        this.updateState({ loading: false })
      }

      return data
    } catch (error) {
      this.updateState({ error: error as AuthError, loading: false })
      throw error
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    this.updateState({ loading: true, error: null })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        this.updateState({ error, loading: false })
        throw error
      }

      return data
    } catch (error) {
      this.updateState({ error: error as AuthError, loading: false })
      throw error
    }
  }

  // Sign in with OAuth provider
  async signInWithProvider(provider: 'google' | 'github' | 'discord') {
    this.updateState({ loading: true, error: null })

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        this.updateState({ error, loading: false })
        throw error
      }

      return data
    } catch (error) {
      this.updateState({ error: error as AuthError, loading: false })
      throw error
    }
  }

  // Sign out
  async signOut() {
    this.updateState({ loading: true })

    try {
      await supabaseSignOut()
      this.updateState({ loading: false })
    } catch (error) {
      this.updateState({ error: error as AuthError, loading: false })
      throw error
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error
    } catch (error) {
      throw error
    }
  }

  // Update password
  async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) throw error
    } catch (error) {
      throw error
    }
  }

  // Update user profile
  async updateProfile(updates: { full_name?: string; avatar_url?: string }) {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', this.authState.user?.id)

      if (error) throw error
    } catch (error) {
      throw error
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance()
