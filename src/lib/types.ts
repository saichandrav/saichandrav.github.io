export interface Product {
  id: string;
  name: string;
  category: 'jewellery' | 'saree';
  subCategory: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  imageKey?: string;
  seller: {
    id: string;
    name: string;
  };
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FlyingItem {
  id: number;
  image: string;
  startX: number;
  startY: number;
}

export type UserRole = 'admin' | 'seller' | 'customer';

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  subCategories: string[];
}