
import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session, createClient } from '@supabase/supabase-js';
import { User } from '../types';

// Supabase configuration
const supabaseUrl = 'https://ifuiowfckpirkjquxjwf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdWlvd2Zja3BpcmtqcXV4andmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NDE1MzIsImV4cCI6MjA3NDMxNzUzMn0.zU_IPQwfGnq1csy51phpjhO_vBOKqp0zMx_NxGwpIP8';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
        } else {
          console.log('Initial session:', session ? 'Found' : 'None');
          setSession(session);
          
          if (session?.user) {
            await loadUserProfile(session.user);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
        setSession(session);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Loading user profile for:', supabaseUser.id);
      
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        // If profile doesn't exist, create a basic user object
        const basicUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          phone: supabaseUser.phone || '',
          userType: 'farmer', // Default type
          profile: null,
          createdAt: new Date(supabaseUser.created_at),
        };
        setUser(basicUser);
      } else {
        console.log('User profile loaded:', profile);
        const fullUser: User = {
          id: profile.user_id,
          email: profile.email,
          phone: profile.phone || '',
          userType: profile.user_type,
          profile: profile.profile_data,
          createdAt: new Date(profile.created_at),
        };
        setUser(fullUser);
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { 
          success: false, 
          error: error.message || 'Login failed. Please try again.',
          needsConfirmation: error.message?.includes('Email not confirmed')
        };
      }

      console.log('Login successful:', data.user?.email);
      return { success: true };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    phone: string;
    password: string;
    userType: 'farmer' | 'company' | 'exporter';
    profile: any;
  }) => {
    console.log('Registration attempt for:', userData.email);
    setLoading(true);
    
    try {
      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email.trim(),
        password: userData.password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });

      if (authError) {
        console.error('Registration error:', authError);
        return { 
          success: false, 
          error: authError.message || 'Registration failed. Please try again.' 
        };
      }

      if (!authData.user) {
        return { 
          success: false, 
          error: 'Registration failed. Please try again.' 
        };
      }

      console.log('User registered successfully:', authData.user.email);

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          email: userData.email.trim(),
          phone: userData.phone,
          user_type: userData.userType,
          profile_data: userData.profile,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail registration if profile creation fails
      }

      return { 
        success: true, 
        needsEmailConfirmation: !authData.session // If no session, email confirmation is needed
      };
    } catch (error) {
      console.error('Unexpected registration error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('User logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Unexpected logout error:', error);
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      console.log('Resending confirmation email to:', email);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });

      if (error) {
        console.error('Resend confirmation error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Unexpected resend error:', error);
      return { success: false, error: 'Failed to resend confirmation email.' };
    }
  };

  return {
    user,
    loading,
    session,
    login,
    register,
    logout,
    resendConfirmation,
  };
};
