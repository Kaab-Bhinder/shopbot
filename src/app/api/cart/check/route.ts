import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../../dbConfig/dbConfig';
import Cart, { ICartItem } from '../../../../models/cartModel';
import { getDataFromToken } from '../../../../helpers/getDataFromToken';

connect();

// GET - Check if specific item exists in cart
export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const size = searchParams.get('size');
    const color = searchParams.get('color');

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return NextResponse.json({
        success: true,
        inCart: false,
        message: "Cart is empty"
      });
    }

    // Check if specific item exists
    const itemExists = cart.items.some((item: ICartItem) => 
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
    );

    return NextResponse.json({
      success: true,
      inCart: itemExists,
      message: itemExists ? "Item is in cart" : "Item not in cart"
    });

  } catch (error: unknown) {
    console.error('Cart check error:', error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
