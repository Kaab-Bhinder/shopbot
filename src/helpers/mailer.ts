import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

interface EmailParams {
  email: string;
  emailType: 'VERIFY' | 'RESET' | 'ORDER_CONFIRMATION';
  userID: string;
  orderHtml?: string;
}

export const sendEmail = async ({ email, emailType, userID, orderHtml }: EmailParams) => {
  try {
    console.log("Attempting to send email...");
    let hashedToken: string | null = null;

    // Update user with token only for VERIFY or RESET types
    if (emailType === 'VERIFY' || emailType === 'RESET') {
      hashedToken = await bcrypt.hash(userID.toString(), 10) as string;
      if (emailType === 'VERIFY') {
        await User.findByIdAndUpdate(userID, {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000 // 1 hour
        });
      } else if (emailType === 'RESET') {
        await User.findByIdAndUpdate(userID, {
          resetPasswordToken: hashedToken,
          resetPasswordExpiry: Date.now() + 3600000 // 1 hour
        });
      }
    }

    // Create transporter using environment variables for production
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("Nodemailer transporter created.");

    let subject = "";
    let htmlContent = "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';

    switch (emailType) {
      case "VERIFY":
        subject = "Verify Your Email";
        htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">TRYON-APP</h1>
              <p style="color: #d1d5db; margin: 10px 0 0 0; font-size: 16px;">Virtual Try-On Fashion Store</p>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; text-align: center; margin: 0 0 30px 0; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">Thank you for creating your account with TRYON-APP. To complete your registration and start exploring our virtual try-on features, please verify your email address.</p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${baseUrl}/verifyemail?token=${hashedToken}" 
                   style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 25px 0 20px 0;">If the button above doesn't work, you can copy and paste this link into your browser:</p>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #1f2937;">
                <p style="word-break: break-all; color: #374151; font-size: 14px; margin: 0; font-family: 'Courier New', monospace;">${baseUrl}/verifyemail?token=${hashedToken}</p>
              </div>
              
              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px; text-align: center;">
                  <strong>⚠️ Important:</strong> This verification link will expire in 1 hour for security reasons.
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">If you didn't create an account with TRYON-APP, please ignore this email. Your email address will not be added to any mailing lists.</p>
            </div>
            
            <div style="background: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2024 TRYON-APP. All rights reserved.</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
            </div>
          </div>
        `;
        break;
      case "RESET":
        subject = "Reset Your Password";
        htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">TRYON-APP</h1>
              <p style="color: #d1d5db; margin: 10px 0 0 0; font-size: 16px;">Virtual Try-On Fashion Store</p>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; text-align: center; margin: 0 0 30px 0; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">We received a request to reset your password for your TRYON-APP account. If you made this request, please click the button below to create a new password.</p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${baseUrl}/resetpassword?token=${hashedToken}" 
                   style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 25px 0 20px 0;">If the button above doesn't work, you can copy and paste this link into your browser:</p>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #1f2937;">
                <p style="word-break: break-all; color: #374151; font-size: 14px; margin: 0; font-family: 'Courier New', monospace;">${baseUrl}/resetpassword?token=${hashedToken}</p>
              </div>
              
              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px; text-align: center;">
                  <strong>⚠️ Important:</strong> This reset link will expire in 1 hour for security reasons.
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <div style="background: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2024 TRYON-APP. All rights reserved.</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
            </div>
          </div>
        `;
        break;
      case "ORDER_CONFIRMATION":
        subject = "Your Order Confirmation";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
            <p>Dear Customer,</p>
            <p>Thank you for your order! Here are your order details:</p>
            ${orderHtml || '<p>Details unavailable.</p>'}
            <p>If you have any questions, please contact us.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 0.8em; text-align: center;">This is an automated message, please do not reply.</p>
          </div>
        `;
        break;
      default:
        subject = "Notification";
        htmlContent = `<p>Hello, this is a notification.</p>`;
    }

    // Email content
    const mailOptions = {
      from: '"Kaab Bhinder" <kaabbhinder28@gmail.com>',
      to: email,
      subject: subject,
      html: htmlContent,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    console.log("Email sent successfully:", mailResponse);
    return mailResponse;

  } catch (error: unknown) {
    console.error('Email sending failed:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to send email');
  }
};