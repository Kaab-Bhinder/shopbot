import Subcategory from '@/models/subcategoryModel';
import { NextResponse } from 'next/server';

// GET all subcategories
export async function GET() {
  const subcategories = await Subcategory.find().populate('category');
  return NextResponse.json(subcategories);
}

// POST create a new subcategory
export async function POST(req: Request) {
  const { name, categoryId } = await req.json();
  if (!name || !categoryId) return NextResponse.json({ error: 'Name and categoryId are required' }, { status: 400 });
  const subcategory = await Subcategory.create({ name, category: categoryId });
  return NextResponse.json(subcategory);
}
