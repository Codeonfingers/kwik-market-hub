// KwikMarket Type Definitions

export type UserRole = 'consumer' | 'vendor' | 'shopper' | 'admin';

export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'preparing' 
  | 'ready' 
  | 'picked_up' 
  | 'inspecting' 
  | 'approved' 
  | 'completed' 
  | 'disputed' 
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  createdAt: Date;
}

export interface Market {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  operatingHours: string;
  vendorCount: number;
  rating: number;
}

export interface Vendor {
  id: string;
  userId: string;
  marketId: string;
  businessName: string;
  description: string;
  image: string;
  rating: number;
  totalOrders: number;
  verified: boolean;
  categories: string[];
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  available: boolean;
  priceHistory: PricePoint[];
}

export interface PricePoint {
  price: number;
  date: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  actualPrice?: number;
  vendorId: string;
  vendorName: string;
}

export interface Order {
  id: string;
  consumerId: string;
  marketId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalEstimate: number;
  totalActual?: number;
  specialInstructions?: string;
  shopperId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shopper {
  id: string;
  userId: string;
  marketId: string;
  available: boolean;
  currentOrders: number;
  completedOrders: number;
  rating: number;
  earnings: number;
}

export interface Job {
  id: string;
  orderId: string;
  marketId: string;
  itemCount: number;
  vendorCount: number;
  estimatedEarnings: number;
  status: 'available' | 'assigned' | 'in_progress' | 'completed';
  consumerName: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'system' | 'payment' | 'rating';
  read: boolean;
  createdAt: Date;
}

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}
