
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/Icon';

export default function AddProductScreen() {
  const { user } = useAuth();
  const [cropType, setCropType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const cropTypes = ['Coffee', 'Teff', 'Spices', 'Grains', 'Vegetables', 'Fruits'];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const simulateAIAssessment = () => {
    // Simulate AI quality assessment
    const scores = [85, 88, 92, 78, 95, 82];
    const score = scores[Math.floor(Math.random() * scores.length)];
    const confidence = Math.floor(Math.random() * 20) + 80;
    
    let grade: 'A' | 'B' | 'C' | 'D';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else grade = 'D';

    return {
      score,
      confidence,
      grade,
      notes: `Quality assessment based on image analysis. ${grade === 'A' ? 'Excellent' : grade === 'B' ? 'Good' : grade === 'C' ? 'Fair' : 'Poor'} quality detected.`
    };
  };

  const handleSubmit = async () => {
    if (!cropType || !quantity || !pricePerUnit || images.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields and add at least one image');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate AI assessment
      const aiAssessment = simulateAIAssessment();
      
      // Simulate product creation
      const newProduct = {
        id: Date.now().toString(),
        farmerId: user?.id || '1',
        farmerName: (user?.profile as any)?.name || 'Unknown Farmer',
        farmerLocation: (user?.profile as any)?.location || 'Unknown Location',
        cropType,
        quantity: parseInt(quantity),
        pricePerUnit: parseFloat(pricePerUnit),
        currency: 'USD',
        qualityGrade: aiAssessment.grade,
        aiAssessment: {
          score: aiAssessment.score,
          confidence: aiAssessment.confidence,
          notes: aiAssessment.notes,
        },
        images,
        description,
        harvestDate: new Date(),
        availableUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        status: 'available' as const,
        createdAt: new Date(),
      };

      console.log('Product created:', newProduct);
      
      Alert.alert(
        'Success!', 
        `Your ${cropType} listing has been created with AI quality grade ${aiAssessment.grade} (${aiAssessment.score}% score)`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          }
        ]
      );
    } catch (error) {
      console.log('Error creating product:', error);
      Alert.alert('Error', 'Failed to create product listing');
    } finally {
      setLoading(false);
    }
  };

  if (user?.userType !== 'farmer') {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Icon name="warning" size={64} color={colors.warning} />
          <Text style={styles.errorText}>Only farmers can add products</Text>
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

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Crop Type *</Text>
              <View style={styles.cropTypeContainer}>
                {cropTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.cropTypeChip,
                      cropType === type && styles.cropTypeChipActive
                    ]}
                    onPress={() => setCropType(type)}
                  >
                    <Text style={[
                      styles.cropTypeText,
                      cropType === type && styles.cropTypeTextActive
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Quantity (kg) *</Text>
              <TextInput
                style={commonStyles.input}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Enter quantity in kilograms"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Price per kg (USD) *</Text>
              <TextInput
                style={commonStyles.input}
                value={pricePerUnit}
                onChangeText={setPricePerUnit}
                placeholder="Enter price per kilogram"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[commonStyles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your product quality, farming methods, etc."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Images *</Text>
            <Text style={styles.sectionSubtitle}>
              Add photos for AI quality assessment
            </Text>
            
            <View style={styles.imagesContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Icon name="close" size={16} color={colors.backgroundAlt} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {images.length < 3 && (
                <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                  <Icon name="camera" size={32} color={colors.primary} />
                  <Text style={styles.addImageText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.aiInfo}>
            <Icon name="sparkles" size={20} color={colors.primary} />
            <Text style={styles.aiInfoText}>
              Our AI will analyze your photos to provide quality grading and assessment
            </Text>
          </View>

          <TouchableOpacity
            style={[buttonStyles.primary, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Listing...' : 'Create Listing'}
            </Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  form: {
    paddingVertical: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
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
  cropTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cropTypeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
  },
  cropTypeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cropTypeText: {
    fontSize: 14,
    color: colors.text,
  },
  cropTypeTextActive: {
    color: colors.backgroundAlt,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  addImageText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  aiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '20',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  aiInfoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  submitButton: {
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.backgroundAlt,
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});
