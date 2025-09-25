
import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const loadUser = async () => {
      try {
        // In a real app, this would check for stored auth tokens
        // For now, we'll simulate no user logged in
        console.log('Loading user data...');
        
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setUser(null);
        console.log('User data loaded successfully');
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Use an IIFE to handle the async function properly
    loadUser().catch((error) => {
      console.error('Unhandled error in loadUser:', error);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string, userType: 'farmer' | 'company' | 'exporter') => {
    console.log('Login attempt:', { email, userType, passwordLength: password.length });
    setLoading(true);
    
    try {
      // Basic validation
      if (!email || !password) {
        console.log('Missing email or password');
        return { success: false, error: 'Email and password are required' };
      }

      if (password.length < 6) {
        console.log('Password too short');
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Simulate API call delay with proper promise handling
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            resolve(true);
          } catch (error) {
            reject(error);
          }
        }, 1000);
      });

      // Simulate login success
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        phone: '+1234567890',
        userType,
        profile: userType === 'farmer' 
          ? {
              name: 'John Farmer',
              location: 'Addis Ababa, Ethiopia',
              farmSize: '5 hectares',
              products: ['Coffee', 'Teff'],
            }
          : {
              companyName: 'Green Trade Co.',
              businessType: 'Agricultural Trading',
              location: 'Addis Ababa, Ethiopia',
              lookingFor: ['Coffee', 'Teff'],
              contactPerson: 'Jane Smith',
            },
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      console.log('User logged in successfully:', mockUser);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    console.log('Registration attempt:', { 
      email: userData.email, 
      userType: userData.userType,
      hasProfile: !!userData.profile 
    });
    setLoading(true);
    
    try {
      // Basic validation
      if (!userData.email || !userData.phone) {
        console.log('Missing required fields');
        return { success: false, error: 'Email and phone are required' };
      }

      // Simulate API call delay with proper promise handling
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            resolve(true);
          } catch (error) {
            reject(error);
          }
        }, 1500);
      });

      // Simulate registration success
      const mockUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        phone: userData.phone,
        userType: userData.userType,
        profile: userData.profile,
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      console.log('User registered successfully:', mockUser);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      console.log('User logging out...');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};
