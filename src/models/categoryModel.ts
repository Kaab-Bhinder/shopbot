import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  sex: 'Men' | 'Women' | 'Unisex';
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  sex: { type: String, enum: ['Men', 'Women', 'Unisex'], required: true },
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
