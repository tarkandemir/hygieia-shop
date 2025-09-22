export interface ICategory {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  wholesalePrice: number;
  retailPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  weight?: number;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
  };
  supplier: {
    name?: string;
    contact?: string;
    email?: string;
    phone?: string;
  };
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ICart {
  items: ICartItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
}

export interface ICustomer {
  name: string;
  surname: string;
  email: string;
  phone: string;
  company?: string;
  taxId?: string;
}

export interface IAddress {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  district: string;
  neighborhood: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface IOrderItem {
  productId: string;
  name: string;
  sku: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: ICustomer;
  billingAddress: IAddress;
  shippingAddress: IAddress;
  items: IOrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial';
  paymentMethod: 'bank_transfer' | 'credit_card' | 'cash' | 'check' | 'other';
  trackingNumber?: string;
  notes?: string;
  orderDate: Date;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}