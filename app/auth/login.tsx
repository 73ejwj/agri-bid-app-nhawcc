
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/Icon';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, resendConfirmation } = useAuth();

  const handleLogin = async () => {
    console.log('Login button pressed');
    console.log('Form data:', { email, passwordLength: password.length });
    
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(email.trim(), password);
      
      if (result.success) {
        console.log('Login successful, navigating to marketplace');
        router.replace('/marketplace');
      } else {
        console.log('Login failed:', result.error);
        
        if (result.needsConfirmation) {
          Alert.alert(
            'Email Not Confirmed',
            'Please check your email and click the confirmation link. Would you like us to resend the confirmation email?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Resend', 
                onPress: async () => {
                  const resendResult = await resendConfirmation(email.trim());
                  if (resendResult.success) {
                    Alert.alert('Success', 'Confirmation email sent! Please check your inbox.');
                  } else {
                    Alert.alert('Error', resendResult.error || 'Failed to resend confirmation email.');
                  }
                }
              }
            ]
          );
        } else {
          Alert.alert('Login Failed', result.error || 'Please try again');
        }
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to AgriBid</Text>
          <Text style={styles.subtitle}>Connect directly with agricultural markets</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={commonStyles.input}
              value={email}
              onChangeText={(text) => {
                console.log('Email changed:', text);
                setEmail(text);
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[commonStyles.input, styles.passwordInput]}
                value={password}
                onChangeText={(text) => {
                  console.log('Password changed, length:', text.length);
                  setPassword(text);
                }}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={colors.textSecondary}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => {
                  console.log('Password visibility toggled');
                  setShowPassword(!showPassword);
                }}
              >
                <Icon 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              buttonStyles.primary, 
              styles.loginButton,
              loading && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => {
              console.log('Navigate to register');
              router.push('/auth/register');
            }}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.backgroundAlt,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  registerLink: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
