
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { createClient } from '@supabase/supabase-js';
import Icon from '../components/Icon';

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

export default function EmailConfirmedScreen() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log('Handling email confirmation...');
        
        // Get the current session to check if user is now confirmed
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setStatus('error');
          setMessage('Failed to confirm email. Please try again.');
          return;
        }

        if (session?.user) {
          console.log('Email confirmed successfully');
          setStatus('success');
          setMessage('Email confirmed successfully! Redirecting to login...');
          
          // Redirect to login after a short delay
          setTimeout(() => {
            router.replace('/auth/login');
          }, 2000);
        } else {
          console.log('No session found');
          setStatus('error');
          setMessage('Email confirmation failed. Please try again.');
          
          // Redirect to login after a short delay
          setTimeout(() => {
            router.replace('/auth/login');
          }, 3000);
        }
      } catch (error) {
        console.error('Error in email confirmation:', error);
        setStatus('error');
        setMessage('An error occurred. Please try logging in.');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.replace('/auth/login');
        }, 3000);
      }
    };

    handleEmailConfirmation();
  }, []);

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {status === 'loading' && (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
          {status === 'success' && (
            <Icon name="checkmark-circle" size={80} color={colors.success} />
          )}
          {status === 'error' && (
            <Icon name="close-circle" size={80} color={colors.error} />
          )}
        </View>
        
        <Text style={styles.title}>
          {status === 'loading' && 'Confirming Email'}
          {status === 'success' && 'Email Confirmed!'}
          {status === 'error' && 'Confirmation Failed'}
        </Text>
        
        <Text style={styles.message}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
