import { NotificationPayload } from '../types';
import { emailService } from './emailService';

// Mock notification service without external dependencies

export class NotificationService {
  private static instance: NotificationService;
  
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private getAdminPhoneNumbers(): string[] {
    const phoneNumbers = process.env.ADMIN_PHONE_NUMBERS;
    return phoneNumbers ? phoneNumbers.split(',') : [];
  }

  private getAdminWhatsAppNumbers(): string[] {
    const whatsAppNumbers = process.env.ADMIN_WHATSAPP_NUMBERS;
    return whatsAppNumbers ? whatsAppNumbers.split(',') : [];
  }

  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    console.log(`📱 Mock SMS to ${phoneNumber}: ${message}`);
    // Simulate successful SMS sending
    return true;
  }

  async sendWhatsApp(phoneNumber: string, message: string): Promise<boolean> {
    console.log(`💬 Mock WhatsApp to ${phoneNumber}: ${message}`);
    // Simulate successful WhatsApp sending
    return true;
  }

  async sendNewReportAlert(reportId: string, description: string, location: string): Promise<void> {
    const message = `🚨 NEW ENVIRONMENTAL REPORT\n\nID: ${reportId}\nDescription: ${description}\nLocation: ${location}\n\nPlease review and take action via the CleanKili Admin Dashboard.\n\nTime: ${new Date().toLocaleString()}`;

    const phoneNumbers = this.getAdminPhoneNumbers();
    const whatsAppNumbers = this.getAdminWhatsAppNumbers();

    // Send SMS alerts
    const smsPromises = phoneNumbers.map(phone => 
      this.sendSMS(phone, message)
    );

    // Send WhatsApp alerts
    const whatsAppPromises = whatsAppNumbers.map(phone => 
      this.sendWhatsApp(phone, message)
    );

    try {
      await Promise.allSettled([...smsPromises, ...whatsAppPromises]);
      console.log('📱 New report alerts sent to admins');
    } catch (error) {
      console.error('❌ Error sending new report alerts:', error);
    }
  }

  async sendDailySummary(summary: string): Promise<void> {
    const message = `📊 DAILY CLEANKILI SUMMARY\n\n${summary}\n\nGenerated: ${new Date().toLocaleString()}`;

    const phoneNumbers = this.getAdminPhoneNumbers();
    const whatsAppNumbers = this.getAdminWhatsAppNumbers();

    // Send SMS summaries
    const smsPromises = phoneNumbers.map(phone => 
      this.sendSMS(phone, message)
    );

    // Send WhatsApp summaries
    const whatsAppPromises = whatsAppNumbers.map(phone => 
      this.sendWhatsApp(phone, message)
    );

    try {
      await Promise.allSettled([...smsPromises, ...whatsAppPromises]);
      console.log('📊 Daily summary sent to admins');
    } catch (error) {
      console.error('❌ Error sending daily summary:', error);
    }
  }

  async sendStatusUpdateAlert(reportId: string, newStatus: string, adminName: string): Promise<void> {
    const message = `📋 REPORT STATUS UPDATE\n\nReport ID: ${reportId}\nNew Status: ${newStatus}\nUpdated by: ${adminName}\n\nTime: ${new Date().toLocaleString()}`;

    const phoneNumbers = this.getAdminPhoneNumbers();
    const whatsAppNumbers = this.getAdminWhatsAppNumbers();

    // Send notifications to other admins
    const smsPromises = phoneNumbers.map(phone => 
      this.sendSMS(phone, message)
    );

    const whatsAppPromises = whatsAppNumbers.map(phone => 
      this.sendWhatsApp(phone, message)
    );

    try {
      await Promise.allSettled([...smsPromises, ...whatsAppPromises]);
      console.log('🔄 Status update alerts sent to admins');
    } catch (error) {
      console.error('❌ Error sending status update alerts:', error);
    }
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<boolean> {
    const message = `🔐 CleanKili Admin Verification\n\nYour verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this message.`;

    return await this.sendSMS(phoneNumber, message);
  }

  async sendInvitationSMS(phoneNumber: string, firstName: string, invitationLink: string): Promise<boolean> {
    const message = `🎉 Welcome to CleanKili Admin Team!\n\nHi ${firstName}, you've been invited to join as an admin.\n\nComplete your registration: ${invitationLink}\n\nValid for 7 days.`;

    return await this.sendSMS(phoneNumber, message);
  }

  // Super Admin specific notifications
  async sendSuperAdminWelcomeEmail(email: string, firstName: string, verificationLink: string): Promise<boolean> {
    return await emailService.sendSuperAdminWelcomeEmail(email, firstName, verificationLink);
  }

  async sendSuperAdminVerificationSMS(phoneNumber: string, firstName: string, otpCode: string): Promise<boolean> {
    const message = `🔐 CleanKili Super Admin Verification\n\nHi ${firstName}, your verification code is: ${otpCode}\n\nThis code expires in 15 minutes.\n\nKeep this secure - Super Admin access provides full system control.`;

    return await this.sendSMS(phoneNumber, message);
  }

  async sendAdminInvitationEmail(email: string, firstName: string, invitationLink: string, inviterName: string): Promise<boolean> {
    return await emailService.sendAdminInvitationEmail(email, firstName, invitationLink, inviterName);
  }

  async sendPasswordResetEmail(email: string, firstName: string, resetLink: string): Promise<boolean> {
    return await emailService.sendPasswordResetEmail(email, firstName, resetLink);
  }

  // Test email configuration
  async testEmailConfiguration(): Promise<{ success: boolean; error?: string }> {
    return await emailService.testEmailConfiguration();
  }

  // Test notification service
  async testNotificationService(): Promise<{ sms: boolean; whatsapp: boolean }> {
    console.log('🧪 Testing notification service (mock mode)');
    
    const results = {
      sms: true,
      whatsapp: true
    };

    console.log('✅ Mock notification test completed');
    return results;
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
