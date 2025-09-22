import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
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

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  category: {
    type: String,
    required: true,
  },
  wholesalePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  retailPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  minStock: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    default: 'adet',
  },
  weight: {
    type: Number,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    default: {},
  },
  supplier: {
    name: String,
    contact: String,
    email: String,
    phone: String,
    default: {},
  },
  tags: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active',
  },
  images: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

// Indexes for better performance
// Note: sku already has unique index from schema definition
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ wholesalePrice: 1 });
ProductSchema.index({ retailPrice: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 