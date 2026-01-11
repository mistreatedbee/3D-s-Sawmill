export type UserRole = 'admin' | 'customer';
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  productType: string;
  woodType: string;
  color: string;
  price: number;
  stock: number;
  dimensions: {
    length: number;
    width?: number;
    height?: number;
    unit: 'mm' | 'cm' | 'm' | 'inches' | 'feet';
  };
  weight: {
    value: number;
    unit: 'kg' | 'lbs' | 'g';
  };
  images: Array<{ url: string; alt?: string; isPrimary?: boolean } | string>;
  isAvailable: boolean;
  featured?: boolean;
  bulkPricing?: Array<{
    minQuantity: number;
    maxQuantity?: number;
    discountPrice: number;
    discountPercentage?: number;
  }>;
  specifications?: {
    material?: string;
    finish?: string;
    moisture?: string;
    gradeOrQuality?: string;
    additionalSpecs?: string;
  };
  tags?: string[];
  minimumOrderQuantity?: number;
  leadTime?: {
    value: number;
    unit: 'days' | 'weeks';
  };
}
export type ProductCategory = 'Plywood' | '4x4 Timber' | 'Boards' | 'Doors' | 'Window Frames' | 'Pillars' | 'Custom Cuts';
export interface CartItem extends Product {
  quantity: number;
}
export type OrderStatus = 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  deliveryMethod: 'pickup' | 'delivery';
  shippingAddress?: string;
  customerName: string;
  customerEmail: string;
}
export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: 'Factory' | 'Projects' | 'Products' | 'Before/After';
}
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
}