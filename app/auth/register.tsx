
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
    if (!email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (userType === 'farmer' && (!farmerName || !location || !farmSize)) {
      Alert.alert('Error', 'Please fill in all farmer profile fields');
      return;
    }

    if (userType !== 'farmer' && (!companyName || !businessType || !contactPerson)) {
      Alert.alert('Error', 'Please fill in all company profile fields');
      return;
    }

    setLoading(true);
    
    const userData = {
      email,
      phone,
      userType,
      profile: userType === 'farmer' 
        ? {
            name: farmerName,
            location,
            farmSize,
            products: products.split(',').map(p => p.trim()).filter(p => p),
          }
        : {
            companyName,
            businessType,
            location,
            contactPerson,
            lookingFor: lookingFor.split(',').map(p => p.trim()).filter(p => p),
          }
    };

    const result = await register(userData);
    
    if (result.success) {
      router.replace('/marketplace');
    } else {
      Alert.alert('Registration Failed', result.error || 'Please try again');
    }
    setLoading(false);
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
            onPress={() => router.back()}
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
                onPress={() => setUserType(type.key)}
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
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={commonStyles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password *</Text>
            <TextInput
              style={commonStyles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password *</Text>
            <TextInput
              style={commonStyles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              placeholderTextColor={colors.textSecondary}
            />
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
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[buttonStyles.primary, styles.registerButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
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
  registerButton: {
    marginTop: 24,
    marginBottom: 24,
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
