# Backend Architecture & Workflow Explanation

## 🏗️ Overall Architecture

Your app uses a **Next.js 13+ App Router** with **API Routes** for the backend. Here's the complete flow:

```
Frontend (React) → API Routes → Database (MongoDB) → Email Service (Nodemailer)
```

## 📧 Email Technology & Packages

### What We're Using:
- **Nodemailer** - Main email sending library
- **SMTP Protocol** - Standard email protocol
- **Gmail SMTP Server** - For sending emails

### Package Details:
```json
"nodemailer": "^3.9.0"  // Latest stable version
"@types/nodemailer": "^6.4.0"  // TypeScript types
```

### Will Emails Expire?
- **Email tokens expire after 1 hour** (security feature)
- **Nodemailer package doesn't expire** - it's a one-time purchase
- **Gmail has daily sending limits** (usually 500-2000 emails/day)

## 🔄 Complete API Workflow

### 1. User Registration Flow
```
User fills signup form → Frontend validation → POST /api/users/signup → 
Create user in MongoDB → Hash password → Generate verification token → 
Send email via Nodemailer → User receives email → Click verification link →
POST /api/users/verifyEmail → Update user.isVerified = true
```

### 2. User Login Flow
```
User fills login form → POST /api/users/login → Check email/password → 
Verify user.isVerified = true → Generate JWT token → Set HTTP-only cookie → 
Return user data → Frontend updates state → Header shows user info
```

### 3. Authentication Check Flow
```
App loads → AuthContext.checkAuth() → GET /api/users/me → 
Extract token from cookie → Verify JWT → Query MongoDB → Return user data → 
Update AuthContext state → Header shows appropriate buttons
```

### 4. Logout Flow
```
User clicks logout → POST /api/users/logout → Clear token cookie → 
Frontend clears user state → Header shows login/signup buttons
```

## 🗄️ Database Schema (MongoDB)

```javascript
User {
  _id: ObjectId,
  fullname: String (required),
  email: String (required, unique, validated),
  password: String (hashed with bcrypt),
  role: String (customer/admin, default: customer),
  isVerified: Boolean (default: false),
  verifyToken: String (for email verification),
  verifyTokenExpiry: Date (1 hour from creation),
  resetPasswordToken: String (for password reset),
  resetPasswordExpiry: Date (1 hour from creation),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

### Password Security:
- **bcrypt hashing** with salt rounds of 10
- **Minimum 6 characters** required
- **Passwords never stored in plain text**

### Token Security:
- **JWT tokens** with 1-day expiration
- **HTTP-only cookies** (can't be accessed by JavaScript)
- **Secure flag** in production
- **SameSite strict** to prevent CSRF attacks

### Email Security:
- **Verification required** before login
- **Tokens expire after 1 hour**
- **Unique tokens** for each operation

## 📁 File Structure

```
src/
├── app/api/users/           # API endpoints
│   ├── signup/route.ts      # User registration
│   ├── login/route.ts       # User authentication
│   ├── logout/route.ts      # User logout
│   ├── me/route.ts          # Get current user
│   ├── verifyEmail/route.ts # Email verification
│   ├── forgetpassword/route.ts # Password reset request
│   └── resetpassword/route.ts  # Password reset
├── models/
│   └── userModel.ts         # MongoDB schema
├── helpers/
│   ├── mailer.ts            # Email sending logic
│   └── getDataFromToken.ts  # JWT token extraction
├── context/
│   └── AuthContext.tsx      # Global auth state
└── components/
    └── Header.tsx           # Dynamic header
```

## 🚀 How to Test

1. **Start the app**: `npm run dev`
2. **Go to signup**: `/signup`
3. **Create account**: Fill form and submit
4. **Check email**: Look for verification email
5. **Verify email**: Click verification link
6. **Login**: Go to `/login` and sign in
7. **See changes**: Header now shows user info instead of login/signup

## 🔧 Environment Variables Needed

```env
# MongoDB (you have these)
MONGODB_URI=mongodb+srv://kaab:kaab@mycluster.awshj.mongodb.net/?retryWrites=true&w=majority&appName=mycluster
MONGODB_DB=TRYON

# JWT (add this)
TOKEN_SECRET=your-super-secret-jwt-key-here

# Email (add these)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Base URL (add this)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 💡 Key Benefits

1. **Secure**: JWT + HTTP-only cookies + bcrypt hashing
2. **User-friendly**: Email verification + password reset
3. **Scalable**: MongoDB + Next.js API routes
4. **Professional**: Beautiful email templates
5. **Responsive**: Dynamic header based on auth state

## 🐛 Common Issues & Solutions

1. **"MONGO_URL not defined"** → Use `MONGODB_URI` instead
2. **Emails not sending** → Check Gmail app password
3. **Tokens not working** → Ensure `TOKEN_SECRET` is set
4. **Build failing** → Remove `connect()` calls from API routes

This system provides enterprise-level authentication with a clean, professional user experience!
