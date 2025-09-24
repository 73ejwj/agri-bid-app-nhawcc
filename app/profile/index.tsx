
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/Icon';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  if (!user) {
    return null;
  }

  const profile = user.profile as any;
  const isFarmer = user.userType === 'farmer';

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Icon name="create" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Icon 
              name={isFarmer ? "leaf" : "business"} 
              size={40} 
              color={colors.primary} 
            />
          </View>
          
          <Text style={styles.name}>
            {isFarmer ? profile.name : profile.companyName}
          </Text>
          
          <View style={styles.userTypeBadge}>
            <Text style={styles.userTypeText}>
              {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.infoItem}>
            <Icon name="mail" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="call" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="location" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>{profile.location}</Text>
          </View>
        </View>

        {isFarmer ? (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Farm Information</Text>
            
            <View style={styles.infoItem}>
              <Icon name="resize" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>Farm Size: {profile.farmSize}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="leaf" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                Products: {profile.products?.join(', ') || 'None specified'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Business Information</Text>
            
            <View style={styles.infoItem}>
              <Icon name="business" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>Type: {profile.businessType}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="person" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>Contact: {profile.contactPerson}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="search" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                Looking for: {profile.lookingFor?.join(', ') || 'Not specified'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionItem}>
            <Icon name="notifications" size={24} color={colors.text} />
            <Text style={styles.actionText}>Notifications</Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <Icon name="help-circle" size={24} color={colors.text} />
            <Text style={styles.actionText}>Help & Support</Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <Icon name="document-text" size={24} color={colors.text} />
            <Text style={styles.actionText}>Terms & Privacy</Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[buttonStyles.outline, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Icon name="log-out" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Member since {user.createdAt.toLocaleDateString()}
          </Text>
          <Text style={styles.footerText}>AgriBid v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  userTypeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.backgroundAlt,
  },
  infoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
    flex: 1,
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
    borderColor: colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
