import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// connect(); // Remove this line to prevent build-time connection

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Check if all fields are provided
    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required", success: false },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials", success: false },
        { status: 400 }
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email before logging in", success: false },
        { status: 400 }
      );
    }

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials", success: false },
        { status: 400 }
      );
    }

    // Create token data
    const tokenData = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET || "your-secret-key", {
      expiresIn: "1d",
    });

    // Set token in cookies
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day
    });

    // Return user data without password
    const userData = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json(
      { message: "Login successful", success: true, user: userData },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
} 