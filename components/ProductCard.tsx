
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return colors.success;
      case 'B': return colors.secondary;
      case 'C': return colors.warning;
      case 'D': return colors.error;
      default: return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: product.images[0] }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.cropType}>{product.cropType}</Text>
          <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(product.qualityGrade) }]}>
            <Text style={styles.gradeText}>Grade {product.qualityGrade}</Text>
          </View>
        </View>
        
        <Text style={styles.farmerName}>{product.farmerName}</Text>
        
        <View style={styles.locationRow}>
          <Icon name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.location}>{product.farmerLocation}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.quantity}>{product.quantity} kg</Text>
          <Text style={styles.price}>${product.pricePerUnit}/kg</Text>
        </View>
        
        <View style={styles.aiScore}>
          <Icon name="checkmark-circle" size={16} color={colors.success} />
          <Text style={styles.aiScoreText}>AI Score: {product.aiAssessment.score}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropType: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.backgroundAlt,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  aiScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiScoreText: {
    fontSize: 14,
    color: colors.success,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default ProductCard;
