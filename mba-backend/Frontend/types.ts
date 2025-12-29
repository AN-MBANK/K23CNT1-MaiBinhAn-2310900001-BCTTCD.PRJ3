
export enum Category {
  LAPTOP = 'Laptop',
  PC = 'PC Gaming',
  ACCESSORIES = 'Phụ kiện',
  MONITOR = 'Màn hình'
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: Category;
  brand: string;
  image: string;
  rating: number;
  reviewsCount: number;
  specs: {
    cpu?: string;
    ram?: string;
    storage?: string;
    gpu?: string;
    screen?: string;
  };
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id?: number;
  username: string;
  password?: string;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  address: string;
  totalPrice: number;
  orderDate: string;
  status: string;
}

export type PaymentMethod = 'COD' | 'MOMO' | 'ZALOPAY' | 'VNPAY';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
