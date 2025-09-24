
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import { mockProducts } from '../../data/mockData';
import { Product } from '../../types';
import Icon from '../../components/Icon';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === id);
    setProduct(foundProduct || null);
  }, [id]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return colors.success;
      case 'B': return colors.secondary;
      case 'C': return colors.warning;
      case 'D': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const handlePlaceOrder = () => {
    if (!product || !user) return;

    Alert.alert(
      'Place Order',
      `Do you want to place an order for ${product.cropType} from ${product.farmerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Order',
          onPress: () => {
            console.log('Order placed for product:', product.id);
            Alert.alert('Success', 'Your order request has been sent to the farmer!');
          }
        }
      ]
    );
  };

  const handleContactFarmer = () => {
    if (!product) return;
    console.log('Opening chat with farmer:', product.farmerId);
    // In a real app, this would open a chat screen
    Alert.alert('Chat', 'Chat feature will be available soon!');
  };

  if (!product) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Icon name="warning" size={64} color={colors.warning} />
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity 
            style={[buttonStyles.primary, { marginTop: 20 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isOwnProduct = user?.id === product.farmerId;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.images[currentImageIndex] }} 
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          {product.images.length > 1 && (
            <View style={styles.imageIndicators}>
              {product.images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    currentImageIndex === index && styles.indicatorActive
                  ]}
                  onPress={() => setCurrentImageIndex(index)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.cropType}>{product.cropType}</Text>
            <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(product.qualityGrade) }]}>
              <Text style={styles.gradeText}>Grade {product.qualityGrade}</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.pricePerUnit}/kg</Text>
            <Text style={styles.quantity}>{product.quantity} kg available</Text>
          </View>

          <View style={styles.farmerInfo}>
            <View style={styles.farmerHeader}>
              <Icon name="person" size={20} color={colors.primary} />
              <Text style={styles.farmerName}>{product.farmerName}</Text>
            </View>
            <View style={styles.locationRow}>
              <Icon name="location" size={16} color={colors.textSecondary} />
              <Text style={styles.location}>{product.farmerLocation}</Text>
            </View>
          </View>

          <View style={styles.aiAssessment}>
            <Text style={styles.sectionTitle}>AI Quality Assessment</Text>
            <View style={styles.aiScore}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreValue}>{product.aiAssessment.score}%</Text>
                <Text style={styles.scoreLabel}>Quality Score</Text>
              </View>
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceValue}>{product.aiAssessment.confidence}%</Text>
                <Text style={styles.confidenceLabel}>Confidence</Text>
              </View>
            </View>
            <Text style={styles.aiNotes}>{product.aiAssessment.notes}</Text>
          </View>

          {product.description && (
            <View style={styles.description}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          )}

          <View style={styles.productDetails}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Harvest Date:</Text>
              <Text style={styles.detailValue}>
                {product.harvestDate.toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Available Until:</Text>
              <Text style={styles.detailValue}>
                {product.availableUntil.toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[styles.detailValue, styles.statusText]}>
                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {!isOwnProduct && user?.userType !== 'farmer' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[buttonStyles.outline, styles.contactButton]}
            onPress={handleContactFarmer}
          >
            <Icon name="chatbubble" size={20} color={colors.primary} />
            <Text style={styles.contactButtonText}>Contact Farmer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[buttonStyles.primary, styles.orderButton]}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.buttonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
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
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: colors.backgroundAlt,
  },
  productInfo: {
    padding: 20,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cropType: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.backgroundAlt,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  quantity: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  farmerInfo: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  farmerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  aiAssessment: {
    backgroundColor: colors.accent + '20',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  aiScore: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary,
  },
  confidenceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  aiNotes: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  description: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  productDetails: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  statusText: {
    color: colors.success,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  orderButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.backgroundAlt,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});
