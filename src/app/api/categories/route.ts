import Category from '@/models/categoryModel';
import { NextResponse } from 'next/server';

// GET all categories
export async function GET() {
  const categories = await Category.find();
  return NextResponse.json(categories);
}

// POST create a new category
export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const category = await Category.create({ name });
  return NextResponse.json(category);
}
