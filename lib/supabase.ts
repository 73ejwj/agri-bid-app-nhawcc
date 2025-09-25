import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/Icon';

export default function RegisterScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'farmer' | 'company' | 'exporter'>('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Farmer fields
  const [farmerName, setFarmerName] = useState('');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [products, setProducts] = useState('');

  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [lookingFor, setLookingFor] = useState('');

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!phone.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (userType === 'farmer' && (!farmerName.trim() || !location.trim() || !farmSize.trim())) {
      Alert.alert('Error', 'Please fill in all farmer profile fields');
      return;
    }

    if (userType !== 'farmer' && (!companyName.trim() || !businessType.trim() || !contactPerson.trim())) {
      Alert.alert('Error', 'Please fill in all company profile fields');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        phone: phone.trim(),
        password,
        userType,
        profile: userType === 'farmer'
          ? {
              name: farmerName.trim(),
              location: location.trim(),
              farmSize: farmSize.trim(),
              products: products.split(',').map(p => p.trim()).filter(p => p),
            }
          : {
              companyName: companyName.trim(),
              businessType: businessType.trim(),
              location: location.trim(),
              contactPerson: contactPerson.trim(),
              lookingFor: lookingFor.split(',').map(p => p.trim()).filter(p => p),
            }
      };

      const result = await register(userData);

      if (result.success) {
        router.replace('/marketplace');
      } else {
        Alert.alert('Registration Failed', result.error || 'Please try again');
      }
    } catch (error) {
      console.error('Unexpected registration error:', error);
      Alert.alert('Registration Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const userTypes = [
    { key: 'farmer', label: 'Farmer', icon: 'leaf' },
    { key: 'company', label: 'Company', icon: 'business' },
    { key: 'exporter', label: 'Exporter', icon: 'airplane' },
  ] as const;

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the AgriBid marketplace</Text>

        {/* User Type Selection */}
        <View style={styles.userTypeContainer}>
          {userTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[styles.userTypeButton, userType === type.key && styles.userTypeButtonActive]}
              onPress={() => setUserType(type.key)}
            >
              <Icon name={type.icon as any} size={20} color={userType === type.key ? colors.backgroundAlt : colors.primary} />
              <Text style={[styles.userTypeText, userType === type.key && styles.userTypeTextActive]}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Phone */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number *</Text>
          <TextInput
            style={commonStyles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[commonStyles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[commonStyles.input, styles.passwordInput]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Farmer or Company Profile */}
        {userType === 'farmer' ? (
          <>
            <Text style={styles.sectionTitle}>Farmer Profile</Text>
            <TextInput style={commonStyles.input} placeholder="Full Name *" value={farmerName} onChangeText={setFarmerName} />
            <TextInput style={commonStyles.input} placeholder="Location *" value={location} onChangeText={setLocation} />
            <TextInput style={commonStyles.input} placeholder="Farm Size *" value={farmSize} onChangeText={setFarmSize} />
            <TextInput style={commonStyles.input} placeholder="Products" value={products} onChangeText={setProducts} />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Company Profile</Text>
            <TextInput style={commonStyles.input} placeholder="Company Name *" value={companyName} onChangeText={setCompanyName} />
            <TextInput style={commonStyles.input} placeholder="Business Type *" value={businessType} onChangeText={setBusinessType} />
            <TextInput style={commonStyles.input} placeholder="Location" value={location} onChangeText={setLocation} />
            <TextInput style={commonStyles.input} placeholder="Contact Person *" value={contactPerson} onChangeText={setContactPerson} />
            <TextInput style={commonStyles.input} placeholder="Looking For" value={lookingFor} onChangeText={setLookingFor} />
          </>
        )}

        {/* Register Button */}
        <TouchableOpacity style={[buttonStyles.primary, { marginTop: 24 }]} onPress={handleRegister} disabled={loading}>
          <Text style={styles.registerButtonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: '700', color: colors.primary, marginTop: 20, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  userTypeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  userTypeButton: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: colors.border, marginHorizontal: 4 },
  userTypeButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  userTypeText: { fontSize: 12, fontWeight: '500', color: colors.text, marginTop: 4 },
  userTypeTextActive: { color: colors.backgroundAlt },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 16, fontWeight: '500', color: colors.text, marginBottom: 8 },
  passwordContainer: { position: 'relative' },
  passwordInput: { paddingRight: 50 },
  passwordToggle: { position: 'absolute', right: 15, top: 15, padding: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16, marginTop: 8 },
  registerButtonText: { fontSize: 16, fontWeight: '600', color: colors.backgroundAlt, textAlign: 'center', paddingVertical: 12 },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  loginText: { fontSize: 16, color: colors.textSecondary },
  loginLink: { fontSize: 16, fontWeight: '600', color: colors.primary },
});
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifuiowfckpirkjquxjwf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdWlvd2Zja3BpcmtqcXV4andmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NDE1MzIsImV4cCI6MjA3NDMxNzUzMn0.zU_IPQwfGnq1csy51phpjhO_vBOKqp0zMx_NxGwpIP8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
