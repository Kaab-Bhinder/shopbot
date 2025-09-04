import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../../dbConfig/dbConfig';
import Review from '../../../../models/reviewModel';

// GET single review by ID
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    
    const review = await Review.findById(id)
      .populate('user', 'fullname email')
      .populate('product', 'name price images');
    
    if (!review) {
      return NextResponse.json({ 
        error: 'Review not found',
        success: false 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      review
    });
  } catch (error: unknown) {
    console.error('Review fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch review';
    return NextResponse.json({ 
      error: errorMessage,
      success: false 
    }, { status: 500 });
  }
}

// PUT update review by ID
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const { rating, comment } = await request.json();
    
    if (!rating) {
      return NextResponse.json({
        error: 'Rating is required',
        success: false
      }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { rating, comment, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('user', 'fullname email')
     .populate('product', 'name price');
    
    if (!review) {
      return NextResponse.json({ 
        error: 'Review not found',
        success: false 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error: unknown) {
    console.error('Review update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update review';
    return NextResponse.json({ 
      error: errorMessage,
      success: false 
    }, { status: 500 });
  }
}

// DELETE review by ID
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    
    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return NextResponse.json({ 
        error: 'Review not found',
        success: false 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Review deleted successfully' 
    });
  } catch (error: unknown) {
    console.error('Review delete error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete review';
    return NextResponse.json({ 
      error: errorMessage,
      success: false 
    }, { status: 500 });
  }
}
