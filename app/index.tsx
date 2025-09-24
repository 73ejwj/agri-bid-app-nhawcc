
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useAuth } from '../hooks/useAuth';

export default function SplashScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        router.replace('/marketplace');
      } else {
        router.replace('/auth/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, loading]);

  return (
    <SafeAreaView style={[commonStyles.container, styles.container]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200' }}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
        
        <Text style={styles.title}>AgriBid</Text>
        <Text style={styles.subtitle}>
          Connecting farmers directly with markets
        </Text>
        
        <View style={styles.tagline}>
          <Text style={styles.taglineText}>
            Fair • Transparent • Efficient
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 4,
    borderColor: colors.backgroundAlt,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.backgroundAlt,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  tagline: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  taglineText: {
    fontSize: 16,
    color: colors.backgroundAlt,
    fontWeight: '500',
    textAlign: 'center',
  },
});
