import { NextRequest, NextResponse } from 'next/server';
import { connect } from "../../../dbConfig/dbConfig";
import Product from "../../../models/productModel";

export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const { searchParams } = new URL(request.url);
    const filter: Record<string, unknown> = {};
    
    // Add filters
    if (searchParams.get('category')) filter.category = searchParams.get('category');
    if (searchParams.get('subcategory')) filter.subcategory = searchParams.get('subcategory');
    if (searchParams.get('sex')) filter.sex = searchParams.get('sex');
    if (searchParams.get('isFeatured')) filter.isFeatured = searchParams.get('isFeatured') === 'true';
    if (searchParams.get('isNewArrival')) filter.isNewArrival = searchParams.get('isNewArrival') === 'true';
    
    // Add pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    console.log('Fetching products with filter:', filter);
    
    // For now, fetch without populate to avoid schema issues
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    console.log(`Found ${products.length} products`);
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total: await Product.countDocuments(filter)
      }
    });
  } catch (error: unknown) {
    console.error("Error fetching products:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();
    // Required: name, price, image, images, sex, category, subcategory
    const requiredFields = ['name', 'price', 'image', 'images', 'sex', 'category', 'subcategory'];
    for (const field of requiredFields) {
      if (!body[field]) return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
    // Ensure images is an array
    if (!Array.isArray(body.images)) {
      return NextResponse.json({ error: 'images must be an array' }, { status: 400 });
    }
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
} 