import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  size?: string;
  color?: string;
  price: number; // Price at the time of adding to cart
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: [1, "Quantity must be at least 1"] 
  },
  size: { 
    type: String, 
    trim: true 
  },
  color: { 
    type: String, 
    trim: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: [0, "Price cannot be negative"] 
  }
});

const CartSchema = new Schema<ICart>({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true // One cart per user
  },
  items: [CartItemSchema],
  total: { 
    type: Number, 
    default: 0,
    min: [0, "Total cannot be negative"] 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for better performance
CartSchema.index({ 'items.product': 1 });

// Calculate total before saving
CartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
