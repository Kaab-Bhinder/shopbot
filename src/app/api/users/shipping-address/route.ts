import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../../dbConfig/dbConfig';
import User from '../../../../models/userModel';
import { getDataFromToken } from '../../../../helpers/getDataFromToken';

// GET user's shipping address
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

    const user = await User.findById(userId).select('shippingAddress fullname email');
    
    return NextResponse.json({
      success: true,
      shippingAddress: user?.shippingAddress || null,
      userInfo: {
        fullname: user?.fullname,
        email: user?.email
      }
    });
  } catch (error: unknown) {
    console.error('Shipping address fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch shipping address';
    return NextResponse.json({ 
      error: errorMessage,
      success: false 
    }, { status: 500 });
  }
}

// PUT update user's shipping address
export async function PUT(request: NextRequest) {
  try {
    await connect();
    
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        success: false 
      }, { status: 401 });
    }

    const shippingAddress = await request.json();

    // Validate required fields
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'postalCode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        return NextResponse.json({
          error: `${field} is required`,
          success: false
        }, { status: 400 });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { shippingAddress },
      { new: true, runValidators: true }
    ).select('shippingAddress');

    return NextResponse.json({
      success: true,
      message: 'Shipping address updated successfully',
      shippingAddress: user?.shippingAddress
    });
  } catch (error: unknown) {
    console.error('Shipping address update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update shipping address';
    return NextResponse.json({ 
      error: errorMessage,
      success: false 
    }, { status: 500 });
  }
}
