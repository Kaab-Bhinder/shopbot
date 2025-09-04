import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../dbConfig/dbConfig';
import Review from '../../../models/reviewModel';

// GET all reviews (optionally filter by product)
export async function GET(request: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    let reviews;
    if (productId) {
      reviews = await Review.find({ product: productId })
        .populate('user', 'fullname')
        .populate('product', 'name')
        .sort({ createdAt: -1 });
    } else {
      reviews = await Review.find()
        .populate('user', 'fullname')
        .populate('product', 'name')
        .sort({ createdAt: -1 });
    }
    
    return NextResponse.json({
      success: true,
      reviews
    });
  } catch (error: unknown) {
    console.error('Reviews fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews';
    return NextResponse.json({ 
      error: errorMessage,
      success: false 
    }, { status: 500 });
  }
}

// POST create a new review
export async function POST(request: NextRequest) {
  try {
    await connect();
    const { userId, productId, rating, comment } = await request.json();
    
    if (!userId || !productId || !rating) {
      return NextResponse.json({ 
        error: 'userId, productId, and rating are required',
        success: false
      }, { status: 400 });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId
    });

    if (existingReview) {
      return NextResponse.json({
        error: 'You have already reviewed this product',
        success: false
      }, { status: 400 });
    }

    const review = new Review({
      user: userId,
      product: productId,
      rating,
      comment
    });

    await review.save();
    
    // Populate user and product details
    await review.populate('user', 'fullname');
    await review.populate('product', 'name');

    return NextResponse.json({
      success: true,
      message: 'Review created successfully',
      review
    });
  } catch (error: unknown) {
    console.error('Review creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create review';
    return NextResponse.json({ 
      error: errorMessage,
      success: false 
    }, { status: 500 });
  }
}
