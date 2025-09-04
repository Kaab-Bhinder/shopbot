
import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  price: {
    type: String,
    required: [true, "Product price is required"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Product image is required"],
    trim: true,
  },
  sex: {
    type: String,
    required: [true, "Product sex is required"],
    enum: ['Men', 'Women'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isNewProduct: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
  },
  originalPrice: {
    type: Number,
    min: [0, "Original price cannot be negative"],
  },
  images: {
    type: [String],
    default: [],
  },
  category_slug: {
    type: String,
    required: [true, "Product category slug is required"],
    enum: ['men', 'women', 'unisex'],
  },
  subcategory_slug: {
    type: String,
    trim: true,
  },
  sizes: {
    type: [String],
    default: ['S', 'M', 'L', 'XL']
  },
  colors: {
    type: [String],
    default: ['Black', 'White']
  },
  material: {
    type: String,
    trim: true,
  },
  care: {
    type: String,
    trim: true,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  isOnSale: {
    type: Boolean,
    default: false,
  },
  discountPercentage: {
    type: Number,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot exceed 100%"],
  },
  stock: {
    type: Number,
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
  tags: {
    type: [String],
    default: [],
  },
  specifications: {
    type: Map,
    of: String,
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

productSchema.index({ category_slug: 1, subcategory_slug: 1 });
productSchema.index({ sex: 1, category: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewProduct: 1 });
productSchema.index({ isOnSale: 1 });

productSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

productSchema.virtual('discountedPrice').get(function() {
  if (this.isOnSale && this.discountPercentage) {
    const numericPrice = parseFloat(this.price.replace(/[^0-9.]/g, ''));
    return (numericPrice - (numericPrice * this.discountPercentage / 100)).toFixed(2);
  }
  return this.price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
