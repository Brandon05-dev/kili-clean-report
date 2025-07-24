import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface Admin {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  status: 'pending' | 'email_verified' | 'phone_verified' | 'active' | 'suspended';
  emailVerified: boolean;
  phoneVerified: boolean;
  emailVerificationToken?: string;
  phoneVerificationCode?: string;
  phoneVerificationExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  role: 'admin' | 'super_admin';
  permissions: string[];
}

export interface AdminRegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
  recaptchaToken: string;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  adminId?: string;
  status?: string;
}

export class AdminService {
  private adminsCollection = 'admins';
  private saltRounds = 12;
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  }

  /**
   * 👤 Register new admin with verification requirements
   */
  async registerAdmin(registrationData: AdminRegistrationData): Promise<VerificationResult> {
    try {
      const { name, email, phone, password, recaptchaToken } = registrationData;

      // Verify reCAPTCHA
      const recaptchaValid = await this.verifyRecaptcha(recaptchaToken);
      if (!recaptchaValid) {
        return { success: false, message: 'reCAPTCHA verification failed' };
      }

      // Check if admin already exists
      const existingAdmin = await this.findAdminByEmailOrPhone(email, phone);
      if (existingAdmin) {
        return { 
          success: false, 
          message: 'Admin with this email or phone already exists' 
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      // Generate verification tokens
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Create admin object
      const admin: Omit<Admin, 'id'> = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password: hashedPassword,
        status: 'pending',
        emailVerified: false,
        phoneVerified: false,
        emailVerificationToken,
        phoneVerificationCode,
        phoneVerificationExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'admin',
        permissions: ['view_reports', 'manage_reports', 'receive_alerts']
      };

      // Save to database
      const docRef = await addDoc(collection(db, this.adminsCollection), {
        ...admin,
        createdAt: Timestamp.fromDate(admin.createdAt),
        updatedAt: Timestamp.fromDate(admin.updatedAt),
        phoneVerificationExpiry: Timestamp.fromDate(admin.phoneVerificationExpiry!)
      });

      console.log(`👤 Admin registered: ${docRef.id} - ${email}`);

      // Send verification email and SMS
      await this.sendEmailVerification(email, emailVerificationToken, name);
      await this.sendPhoneVerification(phone, phoneVerificationCode);

      return {
        success: true,
        message: 'Registration successful. Please check your email and phone for verification codes.',
        adminId: docRef.id,
        status: 'pending'
      };

    } catch (error) {
      console.error('❌ Error registering admin:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  }

  /**
   * ✉️ Verify email using verification token
   */
  async verifyEmail(token: string): Promise<VerificationResult> {
    try {
      const admin = await this.findAdminByEmailToken(token);
      if (!admin) {
        return { success: false, message: 'Invalid or expired verification token' };
      }

      // Update admin status
      await updateDoc(doc(db, this.adminsCollection, admin.id!), {
        emailVerified: true,
        emailVerificationToken: null,
        status: admin.phoneVerified ? 'active' : 'email_verified',
        updatedAt: Timestamp.fromDate(new Date())
      });

      const newStatus = admin.phoneVerified ? 'active' : 'email_verified';
      console.log(`✅ Email verified for admin: ${admin.email} - Status: ${newStatus}`);

      return {
        success: true,
        message: admin.phoneVerified 
          ? 'Email verified! Your admin account is now active.'
          : 'Email verified! Please verify your phone number to complete activation.',
        adminId: admin.id,
        status: newStatus
      };

    } catch (error) {
      console.error('❌ Error verifying email:', error);
      return { success: false, message: 'Email verification failed' };
    }
  }

  /**
   * 📱 Verify phone using SMS OTP
   */
  async verifyPhone(phone: string, code: string): Promise<VerificationResult> {
    try {
      const admin = await this.findAdminByPhone(phone);
      if (!admin) {
        return { success: false, message: 'Admin not found' };
      }

      // Check if code is valid and not expired
      if (admin.phoneVerificationCode !== code) {
        return { success: false, message: 'Invalid verification code' };
      }

      if (admin.phoneVerificationExpiry && new Date() > admin.phoneVerificationExpiry) {
        return { success: false, message: 'Verification code has expired' };
      }

      // Update admin status
      await updateDoc(doc(db, this.adminsCollection, admin.id!), {
        phoneVerified: true,
        phoneVerificationCode: null,
        phoneVerificationExpiry: null,
        status: admin.emailVerified ? 'active' : 'phone_verified',
        updatedAt: Timestamp.fromDate(new Date())
      });

      const newStatus = admin.emailVerified ? 'active' : 'phone_verified';
      console.log(`✅ Phone verified for admin: ${admin.phone} - Status: ${newStatus}`);

      return {
        success: true,
        message: admin.emailVerified 
          ? 'Phone verified! Your admin account is now active.'
          : 'Phone verified! Please verify your email to complete activation.',
        adminId: admin.id,
        status: newStatus
      };

    } catch (error) {
      console.error('❌ Error verifying phone:', error);
      return { success: false, message: 'Phone verification failed' };
    }
  }

  /**
   * 🔐 Admin login with verification check
   */
  async loginAdmin(email: string, password: string): Promise<{ success: boolean; message: string; token?: string; admin?: Partial<Admin> }> {
    try {
      const admin = await this.findAdminByEmail(email);
      if (!admin) {
        return { success: false, message: 'Invalid credentials' };
      }

      // Check password
      const passwordValid = await bcrypt.compare(password, admin.password);
      if (!passwordValid) {
        return { success: false, message: 'Invalid credentials' };
      }

      // Check if admin is active
      if (admin.status !== 'active') {
        let message = 'Account not activated. ';
        if (!admin.emailVerified) message += 'Please verify your email. ';
        if (!admin.phoneVerified) message += 'Please verify your phone number.';
        
        return { success: false, message };
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          adminId: admin.id, 
          email: admin.email, 
          role: admin.role 
        },
        this.jwtSecret,
        { expiresIn: '24h' }
      );

      // Update last login
      await updateDoc(doc(db, this.adminsCollection, admin.id!), {
        lastLogin: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      });

      console.log(`🔐 Admin logged in: ${admin.email}`);

      return {
        success: true,
        message: 'Login successful',
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
          permissions: admin.permissions,
          status: admin.status
        }
      };

    } catch (error) {
      console.error('❌ Error logging in admin:', error);
      return { success: false, message: 'Login failed' };
    }
  }

  /**
   * 📧 Resend email verification
   */
  async resendEmailVerification(email: string): Promise<VerificationResult> {
    try {
      const admin = await this.findAdminByEmail(email);
      if (!admin) {
        return { success: false, message: 'Admin not found' };
      }

      if (admin.emailVerified) {
        return { success: false, message: 'Email already verified' };
      }

      // Generate new token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');

      await updateDoc(doc(db, this.adminsCollection, admin.id!), {
        emailVerificationToken,
        updatedAt: Timestamp.fromDate(new Date())
      });

      await this.sendEmailVerification(admin.email, emailVerificationToken, admin.name);

      return {
        success: true,
        message: 'Verification email resent successfully'
      };

    } catch (error) {
      console.error('❌ Error resending email verification:', error);
      return { success: false, message: 'Failed to resend verification email' };
    }
  }

  /**
   * 📱 Resend phone verification
   */
  async resendPhoneVerification(phone: string): Promise<VerificationResult> {
    try {
      const admin = await this.findAdminByPhone(phone);
      if (!admin) {
        return { success: false, message: 'Admin not found' };
      }

      if (admin.phoneVerified) {
        return { success: false, message: 'Phone already verified' };
      }

      // Generate new code
      const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const phoneVerificationExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await updateDoc(doc(db, this.adminsCollection, admin.id!), {
        phoneVerificationCode,
        phoneVerificationExpiry: Timestamp.fromDate(phoneVerificationExpiry),
        updatedAt: Timestamp.fromDate(new Date())
      });

      await this.sendPhoneVerification(phone, phoneVerificationCode);

      return {
        success: true,
        message: 'Verification code resent successfully'
      };

    } catch (error) {
      console.error('❌ Error resending phone verification:', error);
      return { success: false, message: 'Failed to resend verification code' };
    }
  }

  /**
   * 📧 Send email verification
   */
  private async sendEmailVerification(email: string, token: string, name: string): Promise<void> {
    try {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@cleankili.app',
        to: email,
        subject: '✅ CleanKili Admin - Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">🌿 Welcome to CleanKili Admin!</h2>
            <p>Hello ${name},</p>
            <p>Thank you for registering as a CleanKili administrator. Please verify your email address to continue.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #16a34a; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                ✅ Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link:<br>
              <a href="${verificationUrl}">${verificationUrl}</a>
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #888; font-size: 12px;">
              This email was sent from CleanKili Admin System. 
              If you didn't register for an admin account, please ignore this email.
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`📧 Email verification sent to: ${email}`);

    } catch (error) {
      console.error('❌ Error sending email verification:', error);
      throw error;
    }
  }

  /**
   * 📱 Send phone verification SMS
   */
  private async sendPhoneVerification(phone: string, code: string): Promise<void> {
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      const message = `🌿 CleanKili Admin Verification\n\nYour verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore.`;

      await client.messages.create({
        from: process.env.TWILIO_SMS_NUMBER,
        to: phone,
        body: message
      });

      console.log(`📱 SMS verification sent to: ${phone}`);

    } catch (error) {
      console.error('❌ Error sending SMS verification:', error);
      throw error;
    }
  }

  /**
   * 🤖 Verify reCAPTCHA
   */
  private async verifyRecaptcha(token: string): Promise<boolean> {
    try {
      if (!process.env.RECAPTCHA_SECRET_KEY) {
        console.warn('⚠️ reCAPTCHA secret key not configured');
        return true; // Skip verification in development
      }

      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
      });

      const data = await response.json();
      return data.success && data.score > 0.5; // Adjust score threshold as needed

    } catch (error) {
      console.error('❌ Error verifying reCAPTCHA:', error);
      return false;
    }
  }

  /**
   * 🔍 Helper methods for finding admins
   */
  private async findAdminByEmailOrPhone(email: string, phone: string): Promise<Admin | null> {
    try {
      const emailQuery = query(
        collection(db, this.adminsCollection),
        where('email', '==', email.toLowerCase())
      );
      const phoneQuery = query(
        collection(db, this.adminsCollection),
        where('phone', '==', phone)
      );

      const [emailSnapshot, phoneSnapshot] = await Promise.all([
        getDocs(emailQuery),
        getDocs(phoneQuery)
      ]);

      if (!emailSnapshot.empty) {
        const doc = emailSnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Admin;
      }

      if (!phoneSnapshot.empty) {
        const doc = phoneSnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Admin;
      }

      return null;
    } catch (error) {
      console.error('❌ Error finding admin:', error);
      return null;
    }
  }

  private async findAdminByEmail(email: string): Promise<Admin | null> {
    try {
      const q = query(
        collection(db, this.adminsCollection),
        where('email', '==', email.toLowerCase())
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        phoneVerificationExpiry: data.phoneVerificationExpiry?.toDate(),
        lastLogin: data.lastLogin?.toDate()
      } as Admin;
    } catch (error) {
      console.error('❌ Error finding admin by email:', error);
      return null;
    }
  }

  private async findAdminByPhone(phone: string): Promise<Admin | null> {
    try {
      const q = query(
        collection(db, this.adminsCollection),
        where('phone', '==', phone)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        phoneVerificationExpiry: data.phoneVerificationExpiry?.toDate(),
        lastLogin: data.lastLogin?.toDate()
      } as Admin;
    } catch (error) {
      console.error('❌ Error finding admin by phone:', error);
      return null;
    }
  }

  private async findAdminByEmailToken(token: string): Promise<Admin | null> {
    try {
      const q = query(
        collection(db, this.adminsCollection),
        where('emailVerificationToken', '==', token)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        phoneVerificationExpiry: data.phoneVerificationExpiry?.toDate(),
        lastLogin: data.lastLogin?.toDate()
      } as Admin;
    } catch (error) {
      console.error('❌ Error finding admin by token:', error);
      return null;
    }
  }

  /**
   * 👥 Get all active admins (for notifications)
   */
  async getActiveAdmins(): Promise<Admin[]> {
    try {
      const q = query(
        collection(db, this.adminsCollection),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          phoneVerificationExpiry: data.phoneVerificationExpiry?.toDate(),
          lastLogin: data.lastLogin?.toDate()
        } as Admin;
      });
    } catch (error) {
      console.error('❌ Error getting active admins:', error);
      return [];
    }
  }

  /**
   * 🔑 Verify JWT token
   */
  verifyToken(token: string): { valid: boolean; adminId?: string; error?: string } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      return { valid: true, adminId: decoded.adminId };
    } catch (error) {
      return { valid: false, error: 'Invalid token' };
    }
  }
}
