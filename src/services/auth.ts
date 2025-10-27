import { supabase, getCurrentUser, signOut as supabaseSignOut } from '../lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}

export class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    loading: true,
    error: null,
  };

  private listeners: ((state: AuthState) => void)[] = [];

  private constructor() {
    this.initializeAuth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async initializeAuth() {
    try {
      // Get initial session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        this.updateState({ error, loading: false });
        return;
      }

      if (session?.user) {
        // Update last login
        await (supabase as any)
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', session.user.id);

        this.updateState({ user: session.user, loading: false });
      } else {
        this.updateState({ loading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Update last login
          await (supabase as any)
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', session.user.id);

          this.updateState({ user: session.user, loading: false, error: null });
        } else if (event === 'SIGNED_OUT') {
          this.updateState({ user: null, loading: false, error: null });
        }
      });
    } catch (error) {
      this.updateState({ error: error as AuthError, loading: false });
    }
  }

  private updateState(newState: Partial<AuthState>) {
    this.authState = { ...this.authState, ...newState };
    this.listeners.forEach((listener) => listener(this.authState));
  }

  // Subscribe to auth state changes
  onAuthStateChange(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    // Immediately call with current state
    listener(this.authState);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Get current auth state
  getAuthState(): AuthState {
    return this.authState;
  }

  // Sign up with email and password
  async signUp(email: string, password: string, fullName?: string) {
    this.updateState({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        this.updateState({ error, loading: false });
        throw error;
      }

      // If user is created immediately (no email confirmation required)
      if (data.user && !data.user.email_confirmed_at) {
        this.updateState({ user: data.user, loading: false });
      } else {
        this.updateState({ loading: false });
      }

      return data;
    } catch (error) {
      this.updateState({ error: error as AuthError, loading: false });
      throw error;
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    this.updateState({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.updateState({ error, loading: false });
        throw error;
      }

      return data;
    } catch (error) {
      this.updateState({ error: error as AuthError, loading: false });
      throw error;
    }
  }

  // Ensure user record exists in custom users table (fallback for trigger)
  private async ensureUserRecord(user: User) {
    try {
      // Check if user record exists
      const { data, error } = await (supabase as any).from('users').select('id').eq('id', user.id).single();

      if (error && error.code === 'PGRST116') {
        // Not found
        // Create user record if it doesn't exist
        const { error: insertError } = await (supabase as any).from('users').insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          created_at: user.created_at,
          updated_at: user.updated_at,
        });

        if (insertError) {
          console.error('Error creating user record:', insertError);
        }
      }
    } catch (error) {
      console.error('Error ensuring user record:', error);
    }
  }

  // Verify email OTP (for signup confirmation)
  async verifyOtp(email: string, token: string) {
    this.updateState({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        this.updateState({ error, loading: false });
        throw error;
      }

      // After successful OTP verification, ensure user record exists in custom users table
      if (data.user) {
        await this.ensureUserRecord(data.user);
      }

      return data;
    } catch (error) {
      this.updateState({ error: error as AuthError, loading: false });
      throw error;
    }
  }

  // Sign out
  async signOut() {
    this.updateState({ loading: true });

    try {
      await supabaseSignOut();
      this.updateState({ loading: false });
    } catch (error) {
      this.updateState({ error: error as AuthError, loading: false });
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  // Update password
  async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(updates: { full_name?: string; avatar_url?: string }) {
    if (!this.authState.user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await (supabase as any)
        .from('users')
        .update({
          full_name: updates.full_name,
          avatar_url: updates.avatar_url,
        })
        .eq('id', this.authState.user.id);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
