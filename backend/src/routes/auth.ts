import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '../config/supabase';
import { notificationService } from '../services/notificationService';
import { validateRequest, adminLoginSchema, inviteAdminSchema, completeInvitationSchema } from '../middleware/validation';
import { authenticateAdmin, requireSuperAdmin, AuthenticatedRequest } from '../middleware/auth';
import { AdminLoginRequest, CreateAdminRequest, CompleteInvitationRequest } from '../types';

const router = Router();

// POST /api/auth/login - Admin login
router.post('/login', validateRequest(adminLoginSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password }: AdminLoginRequest = req.body;

    // Find admin by email
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !admin) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
      return;
    }

    // Check if admin is active and verified
    if (!admin.isActive) {
      res.status(403).json({
        success: false,
        error: 'Account is deactivated. Contact super admin.'
      });
      return;
    }

    if (!admin.isVerified) {
      res.status(403).json({
        success: false,
        error: 'Account is not verified. Please complete your registration.'
      });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
      return;
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    const token = jwt.sign(
      { 
        adminId: admin.id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Update last login
    await supabaseAdmin
      .from('admins')
      .update({ lastLogin: new Date().toISOString() })
      .eq('id', admin.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/auth/invite - Invite new admin (Super Admin only)
router.post('/invite', authenticateAdmin, requireSuperAdmin, validateRequest(inviteAdminSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const inviteData: CreateAdminRequest = req.body;
    const invitedBy = req.admin!.id;

    // Check if email already exists
    const { data: existingAdmin } = await supabaseAdmin
      .from('admins')
      .select('email')
      .eq('email', inviteData.email.toLowerCase())
      .single();

    if (existingAdmin) {
      res.status(409).json({
        success: false,
        error: 'Admin with this email already exists'
      });
      return;
    }

    // Check if there's already a pending invitation
    const { data: existingInvitation } = await supabaseAdmin
      .from('admin_invitations')
      .select('id')
      .eq('email', inviteData.email.toLowerCase())
      .eq('isUsed', false)
      .gt('expiresAt', new Date().toISOString())
      .single();

    if (existingInvitation) {
      res.status(409).json({
        success: false,
        error: 'Pending invitation already exists for this email'
      });
      return;
    }

    // Create invitation
    const invitationToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = {
      id: uuidv4(),
      email: inviteData.email.toLowerCase(),
      phone: inviteData.phone,
      firstName: inviteData.firstName,
      lastName: inviteData.lastName,
      role: inviteData.role,
      invitedBy,
      invitationToken,
      expiresAt: expiresAt.toISOString(),
      isUsed: false,
      createdAt: new Date().toISOString()
    };

    const { error } = await supabaseAdmin
      .from('admin_invitations')
      .insert(invitation);

    if (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create invitation',
        details: error.message
      });
      return;
    }

    // Send invitation SMS
    const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/complete-invitation?token=${invitationToken}`;
    
    try {
      await notificationService.sendInvitationSMS(
        inviteData.phone,
        inviteData.firstName,
        invitationLink
      );
    } catch (notificationError) {
      console.error('Failed to send invitation SMS:', notificationError);
      // Don't fail the request if SMS fails
    }

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      data: {
        invitationId: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        invitationLink // Include link in response for testing
      }
    });
  } catch (error) {
    console.error('Invitation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/auth/invitation/:token - Get invitation details
router.get('/invitation/:token', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const { data: invitation, error } = await supabaseAdmin
      .from('admin_invitations')
      .select('*')
      .eq('invitationToken', token)
      .eq('isUsed', false)
      .gt('expiresAt', new Date().toISOString())
      .single();

    if (error || !invitation) {
      res.status(404).json({
        success: false,
        error: 'Invalid or expired invitation token'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        email: invitation.email,
        firstName: invitation.firstName,
        lastName: invitation.lastName,
        role: invitation.role,
        expiresAt: invitation.expiresAt
      }
    });
  } catch (error) {
    console.error('Get invitation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/auth/complete-invitation - Complete admin registration
router.post('/complete-invitation', validateRequest(completeInvitationSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { token, password, verificationCode }: CompleteInvitationRequest = req.body;

    // Find invitation
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('admin_invitations')
      .select('*')
      .eq('invitationToken', token)
      .eq('isUsed', false)
      .gt('expiresAt', new Date().toISOString())
      .single();

    if (invitationError || !invitation) {
      res.status(404).json({
        success: false,
        error: 'Invalid or expired invitation token'
      });
      return;
    }

    // TODO: Verify phone verification code
    // In a real implementation, you would store and verify the SMS code
    // For now, we'll accept any 6-digit code
    if (!/^\d{6}$/.test(verificationCode)) {
      res.status(400).json({
        success: false,
        error: 'Invalid verification code format'
      });
      return;
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create admin account
    const adminId = uuidv4();
    const admin = {
      id: adminId,
      email: invitation.email,
      phone: invitation.phone,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      role: invitation.role,
      passwordHash,
      isActive: true,
      isVerified: true,
      createdAt: new Date().toISOString(),
      invitedBy: invitation.invitedBy
    };

    const { error: adminError } = await supabaseAdmin
      .from('admins')
      .insert(admin);

    if (adminError) {
      console.error('Failed to create admin:', adminError);
      res.status(500).json({
        success: false,
        error: 'Failed to create admin account',
        details: adminError.message
      });
      return;
    }

    // Mark invitation as used
    await supabaseAdmin
      .from('admin_invitations')
      .update({ isUsed: true })
      .eq('id', invitation.id);

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    const jwtToken = jwt.sign(
      { 
        adminId: admin.id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        token: jwtToken,
        admin: {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Complete invitation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/auth/send-verification - Send verification code to phone
router.post('/send-verification', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;

    if (!phone || !/^\+[1-9]\d{1,14}$/.test(phone)) {
      res.status(400).json({
        success: false,
        error: 'Valid phone number is required'
      });
      return;
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: Store verification code in database or cache (Redis) with expiration
    // For now, we'll just send the SMS
    
    const success = await notificationService.sendVerificationCode(phone, verificationCode);

    if (!success) {
      res.status(500).json({
        success: false,
        error: 'Failed to send verification code'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Verification code sent successfully',
      // In development, include the code in response for testing
      ...(process.env.NODE_ENV === 'development' && { verificationCode })
    });
  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
