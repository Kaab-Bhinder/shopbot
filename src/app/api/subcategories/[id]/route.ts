import Subcategory from '@/models/subcategoryModel';
import { NextResponse } from 'next/server';

// GET single subcategory by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subcategory = await Subcategory.findById(id).populate('category');
  if (!subcategory) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
  return NextResponse.json(subcategory);
}

// PUT update subcategory by ID
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, categoryId } = await req.json();
  const subcategory = await Subcategory.findByIdAndUpdate(
    id,
    { name, category: categoryId },
    { new: true }
  ).populate('category');
  if (!subcategory) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
  return NextResponse.json(subcategory);
}

// DELETE subcategory by ID
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subcategory = await Subcategory.findByIdAndDelete(id);
  if (!subcategory) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
  return NextResponse.json({ message: 'Subcategory deleted' });
}
