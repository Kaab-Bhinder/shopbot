import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../dbConfig/dbConfig';
import Order from '../../../models/orderModel';
import Cart from '../../../models/cartModel';
import { getDataFromToken } from '../../../helpers/getDataFromToken';

// GET all orders for a user
export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        success: false 
      }, { status: 401 });
    }

    const orders = await Order.find({ user: userId })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders
    });
  } catch (error: unknown) {
    console.error('Orders fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
    return NextResponse.json({ 
      error: errorMessage,
      success: false 
    }, { status: 500 });
  }
}

// POST create a new order
export async function POST(request: NextRequest) {
  try {
    await connect();
    
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        success: false 
      }, { status: 401 });
    }

    const { 
      orderItems, 
      shippingAddress, 
      paymentMethod, 
      totalAmount,
      notes 
    } = await request.json();

    // Validate required fields
    if (!orderItems || !shippingAddress || !paymentMethod || !totalAmount) {
      return NextResponse.json({
        error: 'Missing required fields',
        success: false
      }, { status: 400 });
    }

    // Validate shipping address
    const requiredAddressFields = ['fullName', 'phone', 'address', 'city', 'postalCode'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        return NextResponse.json({
          error: `${field} is required in shipping address`,
          success: false
        }, { status: 400 });
      }
    }

    // Create order
    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      notes: notes || '',
      orderStatus: 'PENDING'
    });

    await order.save();

    // Clear user's cart after successful order
    await Cart.findOneAndDelete({ user: userId });

    // Populate the order for response
    await order.populate('orderItems.product', 'name images');

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error: unknown) {
    console.error('Order creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ 
      error: errorMessage,
      success: false 
    }, { status: 500 });
  }
}
