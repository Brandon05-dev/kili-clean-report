import { 
  AdminUser, 
  AdminInvite, 
  AdminAction, 
  SuperAdminStats, 
  InviteAdminRequest, 
  CompleteInviteRequest,
  AdminAuthResponse,
  InviteResponse 
} from '../types/admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../index';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  deleteDoc,
  addDoc
} from 'firebase/firestore';

export class SuperAdminService {
  private twilioClient: any;
  private emailTransporter: any;

  constructor() {
    // Initialize Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }

    // Initialize Email transporter
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.emailTransporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    }
  }

  /**
   * 🔐 Super Admin Authentication
   */
  async authenticateSuperAdmin(email: string, password: string): Promise<AdminAuthResponse> {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', email));
      
      if (!adminDoc.exists()) {
        return { success: false, error: 'Invalid credentials' };
      }

      const admin = adminDoc.data() as AdminUser;

      // Check if user is Super Admin
      if (admin.role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Access denied. Super Admin privileges required.' };
      }

      // Check if account is active
      if (admin.status !== 'ACTIVE') {
        return { success: false, error: 'Account is not active' };
      }

      // Verify password
      if (!admin.passwordHash || !await bcrypt.compare(password, admin.passwordHash)) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Update last login
      await updateDoc(doc(db, 'admins', email), {
        lastLoginAt: new Date(),
        updatedAt: new Date()
      });

      // Log the login action
      await this.logAdminAction(admin.id, 'LOGIN', 'Super Admin login successful');

      // Generate JWT token
      const token = this.generateToken(admin);

      return {
        success: true,
        admin,
        token,
        redirectTo: '/super-admin'
      };

    } catch (error) {
      console.error('❌ Super Admin authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * 👥 Invite New Admin
   */
  async inviteAdmin(inviteData: InviteAdminRequest, invitedById: string): Promise<InviteResponse> {
    try {
      // Check if email already exists
      const existingAdmin = await getDoc(doc(db, 'admins', inviteData.email));
      if (existingAdmin.exists()) {
        return { success: false, error: 'Admin with this email already exists' };
      }

      // Check for pending invites
      const pendingInvitesQuery = query(
        collection(db, 'admin_invites'),
        where('email', '==', inviteData.email),
        where('status', 'in', ['SENT', 'EMAIL_VERIFIED', 'PHONE_VERIFIED'])
      );
      const pendingInvites = await getDocs(pendingInvitesQuery);
      
      if (!pendingInvites.empty) {
        return { success: false, error: 'Pending invite already exists for this email' };
      }

      // Generate tokens and OTP
      const invitationToken = uuidv4();
      const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      const inviteId = uuidv4();

      const invite: AdminInvite = {
        id: inviteId,
        name: inviteData.name,
        email: inviteData.email,
        phone: inviteData.phone,
        role: inviteData.role,
        invitedBy: invitedById,
        invitationToken,
        phoneOtp,
        otpExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        invitationExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: 'SENT',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save invite to database
      await setDoc(doc(db, 'admin_invites', inviteId), invite);

      // Send email invitation
      await this.sendInvitationEmail(invite);

      // Send SMS OTP
      await this.sendPhoneOTP(invite);

      // Log the action
      await this.logAdminAction(invitedById, 'INVITE_SENT', `Invited ${inviteData.name} (${inviteData.email}) as ${inviteData.role}`);

      return {
        success: true,
        inviteId,
        message: `Invitation sent to ${inviteData.name}. They will receive an email with instructions and an SMS with verification code.`
      };

    } catch (error) {
      console.error('❌ Error inviting admin:', error);
      return { success: false, error: 'Failed to send invitation' };
    }
  }

  /**
   * ✉️ Send Invitation Email
   */
  private async sendInvitationEmail(invite: AdminInvite): Promise<void> {
    if (!this.emailTransporter) {
      throw new Error('Email service not configured');
    }

    const invitationUrl = `${process.env.FRONTEND_URL}/admin/complete-invite?token=${invite.invitationToken}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 CleanKili Admin Invitation</h1>
            <p>You've been invited to join the CleanKili administration team</p>
          </div>
          <div class="content">
            <p>Hello <strong>${invite.name}</strong>,</p>
            
            <p>You have been invited to join CleanKili as an <strong>${invite.role}</strong>. CleanKili is a comprehensive environmental reporting system that helps communities report and track environmental issues.</p>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Click the button below to accept your invitation</li>
              <li>Enter the SMS verification code sent to ${invite.phone}</li>
              <li>Set up your secure password</li>
              <li>Start managing environmental reports and alerts</li>
            </ol>
            
            <div style="text-align: center;">
              <a href="${invitationUrl}" class="button">Accept Invitation</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              • This invitation expires in 7 days<br>
              • You will also receive an SMS with a verification code<br>
              • Keep your login credentials secure<br>
              • Contact your administrator if you didn't expect this invitation
            </div>
            
            <p><strong>Your Role:</strong> ${invite.role}<br>
            <strong>Phone:</strong> ${invite.phone}<br>
            <strong>Invitation expires:</strong> ${invite.invitationExpiry.toLocaleDateString()}</p>
            
            <p>If you can't click the button, copy and paste this link:</p>
            <p><a href="${invitationUrl}">${invitationUrl}</a></p>
          </div>
          <div class="footer">
            <p>CleanKili Environmental Reporting System<br>
            This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.emailTransporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: invite.email,
      subject: '🌿 CleanKili Admin Invitation - Action Required',
      html: emailHtml
    });

    console.log(`✅ Invitation email sent to ${invite.email}`);
  }

  /**
   * 📱 Send Phone OTP
   */
  private async sendPhoneOTP(invite: AdminInvite): Promise<void> {
    if (!this.twilioClient) {
      throw new Error('SMS service not configured');
    }

    const message = `CleanKili Admin Verification

Your verification code: ${invite.phoneOtp}

This code expires in 15 minutes.

Do not share this code with anyone.`;

    await this.twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_SMS_NUMBER,
      to: invite.phone
    });

    console.log(`✅ OTP SMS sent to ${invite.phone}`);
  }

  /**
   * ✅ Complete Admin Invitation
   */
  async completeInvitation(completeData: CompleteInviteRequest): Promise<AdminAuthResponse> {
    try {
      // Find the invitation
      const invitesQuery = query(
        collection(db, 'admin_invites'),
        where('invitationToken', '==', completeData.invitationToken)
      );
      const inviteSnapshot = await getDocs(invitesQuery);

      if (inviteSnapshot.empty) {
        return { success: false, error: 'Invalid invitation token' };
      }

      const inviteDoc = inviteSnapshot.docs[0];
      const invite = inviteDoc.data() as AdminInvite;

      // Check expiry
      if (new Date() > invite.invitationExpiry) {
        return { success: false, error: 'Invitation has expired' };
      }

      // Verify OTP
      if (invite.phoneOtp !== completeData.phoneOtp) {
        return { success: false, error: 'Invalid verification code' };
      }

      if (new Date() > invite.otpExpiry) {
        return { success: false, error: 'Verification code has expired' };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(completeData.password, 12);

      // Create admin user
      const newAdmin: AdminUser = {
        id: uuidv4(),
        name: invite.name,
        email: invite.email,
        phone: invite.phone,
        role: invite.role,
        status: 'ACTIVE',
        passwordHash,
        invitedBy: invite.invitedBy,
        invitedAt: invite.createdAt,
        emailVerifiedAt: new Date(),
        phoneVerifiedAt: new Date(),
        passwordSetAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save admin to database
      await setDoc(doc(db, 'admins', newAdmin.email), newAdmin);

      // Mark invite as completed
      await updateDoc(doc(db, 'admin_invites', inviteDoc.id), {
        status: 'COMPLETED',
        updatedAt: new Date()
      });

      // Log the activation
      await this.logAdminAction(newAdmin.id, 'ADMIN_ACTIVATED', `Admin account activated for ${newAdmin.name}`);

      // Generate token
      const token = this.generateToken(newAdmin);

      return {
        success: true,
        admin: newAdmin,
        token,
        redirectTo: newAdmin.role === 'SUPER_ADMIN' ? '/super-admin' : '/admin/dashboard'
      };

    } catch (error) {
      console.error('❌ Error completing invitation:', error);
      return { success: false, error: 'Failed to complete invitation' };
    }
  }

  /**
   * 📊 Get Super Admin Dashboard Stats
   */
  async getSuperAdminStats(): Promise<SuperAdminStats> {
    try {
      // Get all admins
      const adminsSnapshot = await getDocs(collection(db, 'admins'));
      const admins = adminsSnapshot.docs.map(doc => doc.data() as AdminUser);

      // Get pending invites
      const pendingInvitesQuery = query(
        collection(db, 'admin_invites'),
        where('status', 'in', ['SENT', 'EMAIL_VERIFIED', 'PHONE_VERIFIED'])
      );
      const pendingInvitesSnapshot = await getDocs(pendingInvitesQuery);

      // Get recent actions
      const recentActionsQuery = query(
        collection(db, 'admin_actions'),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
      const recentActionsSnapshot = await getDocs(recentActionsQuery);
      const recentActions = recentActionsSnapshot.docs.map(doc => doc.data() as AdminAction);

      const stats: SuperAdminStats = {
        totalAdmins: admins.length,
        activeAdmins: admins.filter(a => a.status === 'ACTIVE').length,
        pendingInvites: pendingInvitesSnapshot.size,
        suspendedAdmins: admins.filter(a => a.status === 'SUSPENDED').length,
        recentActions,
        adminsByRole: {
          ADMIN: admins.filter(a => a.role === 'ADMIN').length,
          SUPER_ADMIN: admins.filter(a => a.role === 'SUPER_ADMIN').length
        }
      };

      return stats;

    } catch (error) {
      console.error('❌ Error getting super admin stats:', error);
      throw error;
    }
  }

  /**
   * 👥 Get All Admins
   */
  async getAllAdmins(): Promise<AdminUser[]> {
    try {
      const adminsSnapshot = await getDocs(collection(db, 'admins'));
      return adminsSnapshot.docs.map(doc => {
        const admin = doc.data() as AdminUser;
        // Remove sensitive data
        delete admin.passwordHash;
        return admin;
      });
    } catch (error) {
      console.error('❌ Error getting all admins:', error);
      throw error;
    }
  }

  /**
   * 🚫 Suspend/Reactivate Admin
   */
  async updateAdminStatus(adminEmail: string, status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED', actionById: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'admins', adminEmail), {
        status,
        updatedAt: new Date()
      });

      // Log the action
      const actionType = status === 'SUSPENDED' ? 'ADMIN_SUSPENDED' : 
                        status === 'DEACTIVATED' ? 'ADMIN_DEACTIVATED' : 'ADMIN_ACTIVATED';
      
      await this.logAdminAction(actionById, actionType, `Admin ${adminEmail} status changed to ${status}`, adminEmail);

      return true;
    } catch (error) {
      console.error('❌ Error updating admin status:', error);
      return false;
    }
  }

  /**
   * 🗑️ Remove Admin
   */
  async removeAdmin(adminEmail: string, removedById: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'admins', adminEmail));
      
      // Log the action
      await this.logAdminAction(removedById, 'ADMIN_DEACTIVATED', `Admin ${adminEmail} permanently removed`);

      return true;
    } catch (error) {
      console.error('❌ Error removing admin:', error);
      return false;
    }
  }

  /**
   * 📝 Log Admin Action
   */
  private async logAdminAction(
    adminId: string, 
    action: AdminAction['action'], 
    details: string, 
    targetAdminId?: string
  ): Promise<void> {
    try {
      const actionLog: AdminAction = {
        id: uuidv4(),
        adminId,
        targetAdminId,
        action,
        details,
        timestamp: new Date()
      };

      await addDoc(collection(db, 'admin_actions'), actionLog);
    } catch (error) {
      console.error('❌ Error logging admin action:', error);
    }
  }

  /**
   * 🔑 Generate JWT Token
   */
  private generateToken(admin: AdminUser): string {
    return jwt.sign(
      { 
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        status: admin.status
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  /**
   * 🔍 Verify JWT Token
   */
  verifyToken(token: string): { valid: boolean; adminId?: string; role?: string; error?: string } {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      return {
        valid: true,
        adminId: decoded.adminId,
        role: decoded.role
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid token'
      };
    }
  }
}
