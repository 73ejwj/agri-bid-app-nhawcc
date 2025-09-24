
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
        setUser(null);
      } catch (error) {
        console.log('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string, userType: 'farmer' | 'company' | 'exporter') => {
    setLoading(true);
    try {
      // Simulate login
      const mockUser: User = {
        id: '1',
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
      console.log('User logged in:', mockUser);
      return { success: true };
    } catch (error) {
      console.log('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      // Simulate registration
      const mockUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        phone: userData.phone,
        userType: userData.userType,
        profile: userData.profile,
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      console.log('User registered:', mockUser);
      return { success: true };
    } catch (error) {
      console.log('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    console.log('User logged out');
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};
