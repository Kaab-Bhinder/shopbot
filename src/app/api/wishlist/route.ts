import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../dbConfig/dbConfig';
import Wishlist from '../../../models/wishlistModel';
import Product from '../../../models/productModel';
import { getDataFromToken } from '../../../helpers/getDataFromToken';
import { Types } from 'mongoose';

connect();

// GET - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: 'products',
      model: 'Product',
      select: 'name price image stock sizes colors isOnSale discountPercentage originalPrice'
    });

    if (!wishlist) {
      return NextResponse.json({
        success: true,
        wishlist: { user: userId, products: [] }
      });
    }

    return NextResponse.json({
      success: true,
      wishlist
    });

  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// POST - Add product to wishlist
export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      // Create new wishlist
      wishlist = new Wishlist({
        user: userId,
        products: [new Types.ObjectId(productId)]
      });
    } else {
      // Check if product already exists in wishlist
      if (wishlist.products.some((product: Types.ObjectId) => product.toString() === productId)) {
        return NextResponse.json({
          success: false,
          message: "Product already in wishlist"
        }, { status: 400 });
      }

      // Add product to wishlist
      wishlist.products.push(new Types.ObjectId(productId));
    }

    await wishlist.save();

    // Populate product details
    await wishlist.populate({
      path: 'products',
      model: 'Product',
      select: 'name price image stock sizes colors isOnSale discountPercentage originalPrice'
    });

    return NextResponse.json({
      success: true,
      message: "Product added to wishlist",
      wishlist
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// DELETE - Remove product from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const clearAll = searchParams.get('clearAll');

    if (!productId && clearAll !== 'true') {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 });
    }

    if (clearAll === 'true') {
      // Clear entire wishlist
      wishlist.products = [];
    } else if (productId) {
      // Remove specific product
      wishlist.products = wishlist.products.filter(
        (product: Types.ObjectId) => product.toString() !== productId
      );
    }

    await wishlist.save();

    await wishlist.populate({
      path: 'products',
      model: 'Product',
      select: 'name price image stock sizes colors isOnSale discountPercentage originalPrice'
    });

    return NextResponse.json({
      success: true,
      message: clearAll === 'true' ? "Wishlist cleared" : "Product removed from wishlist",
      wishlist
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
