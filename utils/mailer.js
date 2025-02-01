import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Only for development
  }
});

export const sendWelcomeEmail = async (email, name, password) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: "Welcome to Our Platform",
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Your account has been created successfully.</p>
        <p>Here are your login credentials:</p>
        <p>Email: ${email}</p>
        <p>Password: ${password}</p>
        <p>You can login at: <a href="${process.env.NEXTAUTH_URL}/auth/signin">${process.env.NEXTAUTH_URL}/auth/signin</a></p>
        <p>Please change your password after logging in.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h1>Reset Your Password</h1>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <p><a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const sendBookingConfirmationEmail = async (booking, paymentStatus) => {
  const statusColors = {
    Paid: '#4CAF50',
    Failed: '#F44336',
    Pending: '#FFC107',
    Cancelled: '#9E9E9E'
  };

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: booking.email,
      subject: `Booking Confirmation - ${booking.activityName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2B6CB0; margin-bottom: 20px;">Booking Confirmation</h1>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #2D3748; margin-bottom: 15px;">Booking Details</h2>
                <p><strong>Booking ID:</strong> ${booking._id}</p>
                <p><strong>Activity:</strong> ${booking.activityName}</p>
                <p><strong>Package:</strong> ${booking.packageName}</p>
                <p><strong>Travel Date:</strong> ${new Date(booking.travelDate).toLocaleDateString()}</p>
                <p><strong>Payment Status:</strong> <span style="color: ${statusColors[paymentStatus]}; font-weight: bold;">${paymentStatus}</span></p>
              </div>

              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #2D3748; margin-bottom: 15px;">Guest Information</h2>
                <p><strong>Name:</strong> ${booking.guestName}</p>
                <p><strong>Email:</strong> ${booking.email}</p>
                <p><strong>Phone:</strong> ${booking.phone}</p>
                <p><strong>Nationality:</strong> ${booking.nationality}</p>
              </div>

              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #2D3748; margin-bottom: 15px;">Booking Summary</h2>
                <p><strong>Adults:</strong> ${booking.adults}</p>
                <p><strong>Children:</strong> ${booking.children}</p>
                <p><strong>Total Amount:</strong> ${booking.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'THB' })}</p>
              </div>

              <div style="margin-top: 30px; text-align: center; color: #666;">
                <p>Thank you for choosing our service!</p>
                <p>If you have any questions, please don't hesitate to contact us.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
};
