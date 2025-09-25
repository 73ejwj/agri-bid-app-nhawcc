
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/Icon';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'farmer' | 'company' | 'exporter'>('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Farmer specific fields
  const [farmerName, setFarmerName] = useState('');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [products, setProducts] = useState('');
  
  // Company specific fields
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    console.log('Register button pressed');
    console.log('Form data:', { 
      email, 
      phone, 
      passwordLength: password.length, 
      confirmPasswordLength: confirmPassword.length,
      userType 
    });

    if (!email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
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
        email: email.trim(),
        phone: phone.trim(),
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

      console.log('Submitting registration data:', userData);
      const result = await register(userData);
      
      if (result.success) {
        console.log('Registration successful, navigating to marketplace');
        router.replace('/marketplace');
      } else {
        console.log('Registration failed:', result.error);
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
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              console.log('Back button pressed');
              router.back();
            }}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the AgriBid marketplace</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>I am a:</Text>
          <View style={styles.userTypeContainer}>
            {userTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.userTypeButton,
                  userType === type.key && styles.userTypeButtonActive
                ]}
                onPress={() => {
                  console.log('User type selected:', type.key);
                  setUserType(type.key);
                }}
              >
                <Icon 
                  name={type.icon as any} 
                  size={20} 
                  color={userType === type.key ? colors.backgroundAlt : colors.primary} 
                />
                <Text style={[
                  styles.userTypeText,
                  userType === type.key && styles.userTypeTextActive
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email *</Text>
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
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={commonStyles.input}
              value={phone}
              onChangeText={(text) => {
                console.log('Phone changed:', text);
                setPhone(text);
              }}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[commonStyles.input, styles.passwordInput]}
                value={password}
                onChangeText={(text) => {
                  console.log('Password changed, length:', text.length);
                  setPassword(text);
                }}
                placeholder="Create a password (min 6 characters)"
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

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[commonStyles.input, styles.passwordInput]}
                value={confirmPassword}
                onChangeText={(text) => {
                  console.log('Confirm password changed, length:', text.length);
                  setConfirmPassword(text);
                }}
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={colors.textSecondary}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => {
                  console.log('Confirm password visibility toggled');
                  setShowConfirmPassword(!showConfirmPassword);
                }}
              >
                <Icon 
                  name={showConfirmPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {userType === 'farmer' ? (
            <>
              <Text style={styles.sectionTitle}>Farmer Profile</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={commonStyles.input}
                  value={farmerName}
                  onChangeText={setFarmerName}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textSecondary}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location *</Text>
                <TextInput
                  style={commonStyles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City, Region, Country"
                  placeholderTextColor={colors.textSecondary}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Farm Size *</Text>
                <TextInput
                  style={commonStyles.input}
                  value={farmSize}
                  onChangeText={setFarmSize}
                  placeholder="e.g., 5 hectares"
                  placeholderTextColor={colors.textSecondary}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Products</Text>
                <TextInput
                  style={commonStyles.input}
                  value={products}
                  onChangeText={setProducts}
                  placeholder="Coffee, Teff, Spices (comma separated)"
                  placeholderTextColor={colors.textSecondary}
                  editable={!loading}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Company Profile</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Company Name *</Text>
                <TextInput
                  style={commonStyles.input}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder="Enter company name"
                  placeholderTextColor={colors.textSecondary}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Business Type *</Text>
                <TextInput
                  style={commonStyles.input}
                  value={businessType}
                  onChangeText={setBusinessType}
                  placeholder="e.g., Agricultural Trading"
                  placeholderTextColor={colors.textSecondary}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={commonStyles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City, Region, Country"
                  placeholderTextColor={colors.textSecondary}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contact Person *</Text>
                <TextInput
                  style={commonStyles.input}
                  value={contactPerson}
                  onChangeText={setContactPerson}
                  placeholder="Primary contact name"
                  placeholderTextColor={colors.textSecondary}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Looking For</Text>
                <TextInput
                  style={commonStyles.input}
                  value={lookingFor}
                  onChangeText={setLookingFor}
                  placeholder="Coffee, Teff, Spices (comma separated)"
                  placeholderTextColor={colors.textSecondary}
                  editable={!loading}
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[
              buttonStyles.primary, 
              styles.registerButton,
              loading && styles.registerButtonDisabled
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => {
              console.log('Navigate to login');
              router.push('/auth/login');
            }}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 20,
    padding: 8,
  },
  title: {
    fontSize: 28,
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
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  userTypeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginHorizontal: 4,
  },
  userTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  userTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginTop: 4,
  },
  userTypeTextActive: {
    color: colors.backgroundAlt,
  },
  inputContainer: {
    marginBottom: 16,
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
  registerButton: {
    marginTop: 24,
    marginBottom: 24,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.backgroundAlt,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
