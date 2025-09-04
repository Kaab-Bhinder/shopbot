import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../../dbConfig/dbConfig';
import Order from '../../../../models/orderModel';
import { getDataFromToken } from '../../../../helpers/getDataFromToken';

// GET single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        success: false 
      }, { status: 401 });
    }

    const { id } = await params;
    const order = await Order.findOne({ _id: id, user: userId })
      .populate('orderItems.product', 'name images')
      .populate('user', 'fullname email');

    if (!order) {
      return NextResponse.json({ 
        error: 'Order not found',
        success: false 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error: unknown) {
    console.error('Order fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order';
    return NextResponse.json({ 
      error: errorMessage,
      success: false 
    }, { status: 500 });
  }
}

// PUT update order status (admin only - for now just allow status updates)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    
    const { id } = await params;
    const { orderStatus, deliveryDate, notes } = await request.json();

    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (deliveryDate) updateData.deliveryDate = deliveryDate;
    if (notes !== undefined) updateData.notes = notes;

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('orderItems.product', 'name images');

    if (!order) {
      return NextResponse.json({ 
        error: 'Order not found',
        success: false 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error: unknown) {
    console.error('Order update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update order';
    return NextResponse.json({ 
      error: errorMessage,
      success: false 
    }, { status: 500 });
  }
}
