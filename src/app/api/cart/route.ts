import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../dbConfig/dbConfig';
import Cart, { ICartItem } from '../../../models/cartModel';
import Product from '../../../models/productModel';
import { getDataFromToken } from '../../../helpers/getDataFromToken';
import { Types } from 'mongoose';

connect();

// GET - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      model: 'Product',
      select: 'name price image stock sizes colors'
    });

    if (!cart) {
      return NextResponse.json({
        success: true,
        cart: { user: userId, items: [], total: 0 }
      });
    }

    return NextResponse.json({
      success: true,
      cart
    });

  } catch (error: unknown) {
    console.error('Cart fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1, size, color } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Check if product exists and get current price
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    // Get current price (handle discounted price)
    const currentPrice = product.isOnSale && product.discountPercentage 
      ? parseFloat(product.price.replace(/[^0-9.]/g, '')) - (parseFloat(product.price.replace(/[^0-9.]/g, '')) * product.discountPercentage / 100)
      : parseFloat(product.price.replace(/[^0-9.]/g, ''));

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: userId,
        items: [{
          product: new Types.ObjectId(productId),
          quantity,
          size,
          color,
          price: currentPrice
        } as ICartItem]
      });
    } else {
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (item: ICartItem) => item.product.toString() === productId && 
                item.size === size && 
                item.color === color
      );

      if (existingItemIndex > -1) {
        // Item already exists - return message instead of updating
        return NextResponse.json({
          success: false,
          message: "Item already in cart",
          cart
        }, { status: 400 });
      } else {
        // Add new item
        cart.items.push({
          product: new Types.ObjectId(productId),
          quantity,
          size,
          color,
          price: currentPrice
        } as ICartItem);
      }
    }

    await cart.save();

    // Populate product details
    await cart.populate({
      path: 'items.product',
      model: 'Product',
      select: 'name price image stock sizes colors'
    });

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
      cart
    });

  } catch (error: unknown) {
    console.error('Add to cart error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Update cart item
export async function PUT(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity, size, color } = await request.json();

    if (!productId || quantity < 1) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (item: ICartItem) => item.product.toString() === productId && 
              item.size === size && 
              item.color === color
    );

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    // Check stock
    const product = await Product.findById(productId);
    if (product && product.stock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: 'items.product',
      model: 'Product',
      select: 'name price image stock sizes colors'
    });

    return NextResponse.json({
      success: true,
      message: "Cart updated",
      cart
    });

  } catch (error: unknown) {
    console.error('Update cart error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Remove item from cart or clear cart
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const clearAll = searchParams.get('clearAll');

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (clearAll === 'true') {
      // Clear entire cart
      cart.items = [];
    } else if (productId) {
      // Remove specific item
      cart.items = cart.items.filter(
        (item: ICartItem) => !(item.product.toString() === productId && 
                 item.size === size && 
                 item.color === color)
      );
    } else {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await cart.save();

    await cart.populate({
      path: 'items.product',
      model: 'Product',
      select: 'name price image stock sizes colors'
    });

    return NextResponse.json({
      success: true,
      message: clearAll === 'true' ? "Cart cleared" : "Item removed from cart",
      cart
    });

  } catch (error: unknown) {
    console.error('Delete cart error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
