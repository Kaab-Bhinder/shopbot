import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubcategory extends Document {
  name: string;
  category: Types.ObjectId;
}

const SubcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
});

export default mongoose.models.Subcategory || mongoose.model<ISubcategory>('Subcategory', SubcategorySchema);
