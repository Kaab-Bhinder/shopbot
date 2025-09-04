import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../../dbConfig/dbConfig';
import Wishlist from '../../../../models/wishlistModel';
import { getDataFromToken } from '../../../../helpers/getDataFromToken';
import { Types } from 'mongoose';

connect();

// GET - Check if specific product exists in wishlist
export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      return NextResponse.json({
        success: true,
        inWishlist: false,
        message: "Wishlist is empty"
      });
    }

    // Check if product exists in wishlist
    const productExists = wishlist.products.some((product: Types.ObjectId) => 
      product.toString() === productId
    );

    return NextResponse.json({
      success: true,
      inWishlist: productExists,
      message: productExists ? "Product is in wishlist" : "Product not in wishlist"
    });

  } catch (error: unknown) {
    console.error('Wishlist check error:', error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
