
export interface User {
  id: string;
  email: string;
  phone: string;
  userType: 'farmer' | 'company' | 'exporter';
  profile: FarmerProfile | CompanyProfile;
  createdAt: Date;
}

export interface FarmerProfile {
  name: string;
  location: string;
  farmSize: string;
  products: string[];
  avatar?: string;
}

export interface CompanyProfile {
  companyName: string;
  businessType: string;
  location: string;
  lookingFor: string[];
  contactPerson: string;
  avatar?: string;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  cropType: string;
  quantity: number;
  pricePerUnit: number;
  currency: string;
  qualityGrade: 'A' | 'B' | 'C' | 'D';
  aiAssessment: {
    score: number;
    confidence: number;
    notes: string;
  };
  images: string[];
  description: string;
  harvestDate: Date;
  availableUntil: Date;
  status: 'available' | 'reserved' | 'sold';
  createdAt: Date;
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  farmerId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  productId?: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
