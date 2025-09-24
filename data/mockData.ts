
import { Product, User } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    farmerId: '1',
    farmerName: 'Ahmed Hassan',
    farmerLocation: 'Jimma, Ethiopia',
    cropType: 'Coffee',
    quantity: 500,
    pricePerUnit: 25.50,
    currency: 'USD',
    qualityGrade: 'A',
    aiAssessment: {
      score: 92,
      confidence: 88,
      notes: 'Excellent bean quality, uniform size, minimal defects'
    },
    images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400'],
    description: 'Premium Arabica coffee beans, shade-grown and hand-picked. Perfect for specialty coffee roasters.',
    harvestDate: new Date('2024-01-15'),
    availableUntil: new Date('2024-03-15'),
    status: 'available',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    farmerId: '2',
    farmerName: 'Fatima Kebede',
    farmerLocation: 'Debre Zeit, Ethiopia',
    cropType: 'Teff',
    quantity: 1000,
    pricePerUnit: 3.20,
    currency: 'USD',
    qualityGrade: 'A',
    aiAssessment: {
      score: 89,
      confidence: 91,
      notes: 'High-quality teff grains, excellent color and texture'
    },
    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'],
    description: 'Organic teff grains, perfect for injera production and export markets.',
    harvestDate: new Date('2024-01-10'),
    availableUntil: new Date('2024-04-10'),
    status: 'available',
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    farmerId: '3',
    farmerName: 'Bekele Tadesse',
    farmerLocation: 'Hawassa, Ethiopia',
    cropType: 'Coffee',
    quantity: 300,
    pricePerUnit: 22.00,
    currency: 'USD',
    qualityGrade: 'B',
    aiAssessment: {
      score: 78,
      confidence: 85,
      notes: 'Good quality beans with minor variations in size'
    },
    images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'],
    description: 'High-quality Sidamo coffee beans with distinctive flavor profile.',
    harvestDate: new Date('2024-01-12'),
    availableUntil: new Date('2024-03-12'),
    status: 'available',
    createdAt: new Date('2024-01-19'),
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'ahmed@farmer.com',
    phone: '+251911234567',
    userType: 'farmer',
    profile: {
      name: 'Ahmed Hassan',
      location: 'Jimma, Ethiopia',
      farmSize: '12 hectares',
      products: ['Coffee', 'Spices'],
    },
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'greentrade@company.com',
    phone: '+251911234568',
    userType: 'company',
    profile: {
      companyName: 'Green Trade Ethiopia',
      businessType: 'Agricultural Trading',
      location: 'Addis Ababa, Ethiopia',
      lookingFor: ['Coffee', 'Teff', 'Spices'],
      contactPerson: 'Sarah Johnson',
    },
    createdAt: new Date('2024-01-02'),
  },
];
