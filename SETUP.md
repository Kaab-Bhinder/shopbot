# Authentication Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/tryon

# JWT Secret
TOKEN_SECRET=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Base URL for email links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Features Implemented

### 1. User Authentication
- **Signup**: User registration with email verification
- **Login**: User authentication with JWT tokens
- **Logout**: Secure logout with token removal
- **Email Verification**: Email verification system for new accounts

### 2. User Model
- Full name, email, password
- Role-based access (customer/admin)
- Email verification status
- Password reset functionality
- Timestamps for creation and updates

### 3. API Routes
- `/api/users/signup` - User registration
- `/api/users/login` - User authentication
- `/api/users/logout` - User logout
- `/api/users/me` - Get current user info
- `/api/users/verifyEmail` - Email verification
- `/api/users/forgetpassword` - Password reset request
- `/api/users/resetpassword` - Password reset

### 4. Frontend Components
- **AuthContext**: Global authentication state management
- **Header**: Dynamic header showing login/signup or user info
- **Login Page**: User login form
- **Signup Page**: User registration form

### 5. Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies for token storage
- Email verification requirement
- Password strength validation

## How to Use

1. **Start the application**: `npm run dev`
2. **Navigate to signup**: `/signup` to create an account
3. **Check email**: Verify your email address
4. **Login**: Use `/login` to sign in
5. **Header changes**: Automatically shows user info when logged in

## Database Connection

The app automatically connects to MongoDB using the connection string from your environment variables. Make sure MongoDB is running and accessible.

## Email Configuration

For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in EMAIL_PASS

## Token Management

- JWT tokens are stored in HTTP-only cookies
- Tokens expire after 1 day
- Automatic token validation on protected routes
- Secure logout removes tokens from cookies

