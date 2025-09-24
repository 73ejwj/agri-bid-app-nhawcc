
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import { mockProducts } from '../../data/mockData';
import { Product } from '../../types';
import ProductCard from '../../components/ProductCard';
import SearchFilter from '../../components/SearchFilter';
import Icon from '../../components/Icon';

export default function MarketplaceScreen() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login');
    }
  }, [user]);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.cropType.toLowerCase().includes(query.toLowerCase()) ||
      product.farmerName.toLowerCase().includes(query.toLowerCase()) ||
      product.farmerLocation.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleFilter = (filters: any) => {
    console.log('Applying filters:', filters);
    let filtered = [...products];

    if (filters.cropType) {
      filtered = filtered.filter(product => product.cropType === filters.cropType);
    }

    if (filters.qualityGrade) {
      filtered = filtered.filter(product => product.qualityGrade === filters.qualityGrade);
    }

    setFilteredProducts(filtered);
  };

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.id);
    router.push(`/product/${product.id}`);
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user.userType === 'farmer' ? (user.profile as any).name : (user.profile as any).companyName}</Text>
          <Text style={styles.subtitle}>Discover quality agricultural products</Text>
        </View>
        
        <View style={styles.headerActions}>
          {user.userType === 'farmer' && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/product/add')}
            >
              <Icon name="add" size={24} color={colors.backgroundAlt} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <Icon name="person" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        >
          <Text style={styles.sectionTitle}>
            Available Products ({filteredProducts.length})
          </Text>
          
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="leaf-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No products found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => handleProductPress(product)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    backgroundColor: colors.background,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  productsList: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
