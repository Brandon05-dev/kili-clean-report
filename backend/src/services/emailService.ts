import nodemailer from 'nodemailer';
import { NotificationPayload } from '../types';

// Email service with real SMTP functionality
export class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter | null = null;

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    // Check if email configuration is available
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Email service disabled - missing SMTP configuration');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false // Allow self-signed certificates
        }
      });

      console.log('📧 Email service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      this.transporter = null;
    }
  }

  async sendEmail(to: string, subject: string, htmlContent: string, textContent?: string): Promise<boolean> {
    if (!this.transporter) {
      console.log(`📧 Mock Email (no SMTP configured):`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${textContent || htmlContent}`);
      return true;
    }

    try {
      const mailOptions = {
        from: `"CleanKili Admin" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text: textContent,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email sent successfully to ${to}. Message ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send email to ${to}:`, error);
      return false;
    }
  }

  async sendSuperAdminWelcomeEmail(email: string, firstName: string, verificationLink: string): Promise<boolean> {
    const subject = 'Welcome to CleanKili - Super Admin Access';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e, #15803d); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ CleanKili Super Admin</h1>
            <p>Welcome to the Environmental Management Platform</p>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>You have been granted <strong>Super Admin</strong> access to the CleanKili platform. This gives you full administrative control over the environmental reporting system.</p>
            
            <p>To activate your account, please verify your email address by clicking the button below:</p>
            
            <p style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Account</a>
            </p>
            
            <div class="warning">
              <strong>⚠️ Important Security Notice:</strong>
              <ul>
                <li>This verification link expires in 24 hours</li>
                <li>As a Super Admin, you have full system access</li>
                <li>You can create, modify, and delete other admin accounts</li>
                <li>Please keep your credentials secure</li>
              </ul>
            </div>
            
            <p>If you didn't expect to receive this email, please contact the system administrator immediately.</p>
            
            <p>Best regards,<br>The CleanKili Team</p>
          </div>
          <div class="footer">
            <p>CleanKili Environmental Reporting Platform<br>
            This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
      Welcome to CleanKili - Super Admin Access
      
      Hello ${firstName}!
      
      You have been granted Super Admin access to the CleanKili platform.
      
      To activate your account, please verify your email address by visiting this link:
      ${verificationLink}
      
      IMPORTANT SECURITY NOTICE:
      - This verification link expires in 24 hours
      - As a Super Admin, you have full system access
      - You can create, modify, and delete other admin accounts
      - Please keep your credentials secure
      
      If you didn't expect to receive this email, please contact the system administrator immediately.
      
      Best regards,
      The CleanKili Team
      
      ---
      CleanKili Environmental Reporting Platform
      This is an automated message, please do not reply.
    `;

    return await this.sendEmail(email, subject, htmlContent, textContent);
  }

  async sendAdminInvitationEmail(email: string, firstName: string, invitationLink: string, inviterName: string): Promise<boolean> {
    const subject = 'Invitation to Join CleanKili Admin Team';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e, #15803d); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          .info-box { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 CleanKili Admin Team</h1>
            <p>Environmental Impact Management</p>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>You've been invited by <strong>${inviterName}</strong> to join the CleanKili admin team. Help us make a positive environmental impact in our community!</p>
            
            <div class="info-box">
              <strong>🎯 As an Admin, you'll be able to:</strong>
              <ul>
                <li>Review and manage environmental reports</li>
                <li>Track resolution progress</li>
                <li>Communicate with community members</li>
                <li>Generate impact reports</li>
              </ul>
            </div>
            
            <p>To complete your registration and set up your account, click the button below:</p>
            
            <p style="text-align: center;">
              <a href="${invitationLink}" class="button">Complete Registration</a>
            </p>
            
            <p><strong>Note:</strong> This invitation link is valid for 7 days.</p>
            
            <p>Welcome to the team!</p>
            
            <p>Best regards,<br>The CleanKili Team</p>
          </div>
          <div class="footer">
            <p>CleanKili Environmental Reporting Platform<br>
            Making our communities cleaner, one report at a time.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
      Invitation to Join CleanKili Admin Team
      
      Hello ${firstName}!
      
      You've been invited by ${inviterName} to join the CleanKili admin team.
      
      As an Admin, you'll be able to:
      - Review and manage environmental reports
      - Track resolution progress
      - Communicate with community members
      - Generate impact reports
      
      To complete your registration, visit: ${invitationLink}
      
      Note: This invitation link is valid for 7 days.
      
      Welcome to the team!
      
      Best regards,
      The CleanKili Team
    `;

    return await this.sendEmail(email, subject, htmlContent, textContent);
  }

  async sendPasswordResetEmail(email: string, firstName: string, resetLink: string): Promise<boolean> {
    const subject = 'CleanKili Admin - Password Reset Request';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>CleanKili Admin Account</p>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>We received a request to reset your CleanKili admin account password.</p>
            
            <p>If you made this request, click the button below to reset your password:</p>
            
            <p style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            
            <div class="warning">
              <strong>⚠️ Security Information:</strong>
              <ul>
                <li>This link expires in 1 hour for security</li>
                <li>If you didn't request this reset, ignore this email</li>
                <li>Your password will remain unchanged if you don't click the link</li>
              </ul>
            </div>
            
            <p>If you're having trouble with the button, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetLink}</p>
            
            <p>Best regards,<br>The CleanKili Team</p>
          </div>
          <div class="footer">
            <p>CleanKili Environmental Reporting Platform<br>
            This is an automated security message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
      CleanKili Admin - Password Reset Request
      
      Hello ${firstName}!
      
      We received a request to reset your CleanKili admin account password.
      
      If you made this request, visit this link to reset your password:
      ${resetLink}
      
      SECURITY INFORMATION:
      - This link expires in 1 hour for security
      - If you didn't request this reset, ignore this email
      - Your password will remain unchanged if you don't click the link
      
      Best regards,
      The CleanKili Team
    `;

    return await this.sendEmail(email, subject, htmlContent, textContent);
  }

  async testEmailConfiguration(): Promise<{ success: boolean; error?: string }> {
    if (!this.transporter) {
      return { success: false, error: 'Email transporter not initialized - check SMTP configuration' };
    }

    try {
      await this.transporter.verify();
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();
