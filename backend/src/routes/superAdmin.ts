import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '../config/supabase';
import { notificationService } from '../services/notificationService';
import { authenticateAdmin, requireSuperAdmin, AuthenticatedRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createSuperAdminSchema, updateSuperAdminSchema } from '../middleware/validation';

const router = Router();

// All super admin routes require Super Admin authentication
router.use(authenticateAdmin);
router.use(requireSuperAdmin);

/**
 * POST /api/super-admins
 * Create a new Super Admin
 * 
 * Security: Only existing Super Admins can create new Super Admins
 * Process:
 * 1. Validate input data
 * 2. Check for existing email/phone
 * 3. Hash password with bcrypt
 * 4. Save to database with role='Super Admin' and status='INVITED'
 * 5. Send verification email and SMS
 */
router.post('/', validateRequest(createSuperAdminSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, phoneNumber, password, firstName, lastName } = req.body;
    const createdBy = req.admin!.id;

    // Check if email already exists
    const { data: existingAdmin, error: emailCheckError } = await supabaseAdmin
      .from('admins')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (emailCheckError && emailCheckError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Database error checking email:', emailCheckError);
      res.status(500).json({
        success: false,
        error: 'Database error occurred',
        details: emailCheckError.message
      });
      return;
    }

    if (existingAdmin) {
      res.status(409).json({
        success: false,
        error: 'Super Admin with this email already exists'
      });
      return;
    }

    // Check if phone number already exists
    const { data: existingPhone, error: phoneCheckError } = await supabaseAdmin
      .from('admins')
      .select('phone')
      .eq('phone', phoneNumber)
      .single();

    if (phoneCheckError && phoneCheckError.code !== 'PGRST116') {
      console.error('Database error checking phone:', phoneCheckError);
      res.status(500).json({
        success: false,
        error: 'Database error occurred',
        details: phoneCheckError.message
      });
      return;
    }

    if (existingPhone) {
      res.status(409).json({
        success: false,
        error: 'Super Admin with this phone number already exists'
      });
      return;
    }

    // Hash password with bcrypt
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create verification token
    const verificationToken = uuidv4();

    // Create new Super Admin
    const newSuperAdmin = {
      id: uuidv4(),
      email: email.toLowerCase(),
      phone: phoneNumber,
      firstName,
      lastName,
      passwordHash,
      role: 'Super Admin' as const,
      status: 'INVITED',
      isActive: true,
      isVerified: false,
      invitedBy: createdBy,
      createdAt: new Date().toISOString()
    };

    const { data: createdAdmin, error: createError } = await supabaseAdmin
      .from('admins')
      .insert(newSuperAdmin)
      .select(`
        id,
        email,
        phone,
        firstName,
        lastName,
        role,
        status,
        isActive,
        isVerified,
        createdAt
      `)
      .single();

    if (createError) {
      console.error('Database error creating Super Admin:', createError);
      res.status(500).json({
        success: false,
        error: 'Failed to create Super Admin',
        details: createError.message
      });
      return;
    }

    // Generate verification links
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/verify-account?token=${verificationToken}`;

    // Send verification email
    try {
      await notificationService.sendSuperAdminWelcomeEmail(
        email,
        firstName,
        verificationLink
      );
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the request if email fails
    }

    // Send verification SMS with OTP
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      
      // Store OTP in verification_codes table
      await supabaseAdmin
        .from('verification_codes')
        .insert({
          id: uuidv4(),
          phone: phoneNumber,
          code: otpCode,
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
          created_at: new Date().toISOString()
        });

      await notificationService.sendSuperAdminVerificationSMS(
        phoneNumber,
        firstName,
        otpCode
      );
    } catch (smsError) {
      console.error('Failed to send verification SMS:', smsError);
      // Don't fail the request if SMS fails
    }

    // Log the creation action for security
    console.log(`Super Admin created: ${email} by ${req.admin!.email} at ${new Date().toISOString()}`);

    res.status(201).json({
      success: true,
      message: 'Super Admin created successfully. Verification email and SMS sent.',
      data: {
        id: createdAdmin.id,
        email: createdAdmin.email,
        phone: createdAdmin.phone,
        firstName: createdAdmin.firstName,
        lastName: createdAdmin.lastName,
        role: createdAdmin.role,
        status: createdAdmin.status,
        isActive: createdAdmin.isActive,
        isVerified: createdAdmin.isVerified,
        createdAt: createdAdmin.createdAt,
        verificationLink // Include for testing purposes
      }
    });

  } catch (error) {
    console.error('Error creating Super Admin:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/super-admins/:id
 * Delete an existing Super Admin
 * 
 * Security: Only existing Super Admins can delete other Super Admins
 * Safeguards:
 * 1. Cannot delete yourself
 * 2. Cannot delete the last remaining Super Admin
 * 3. Action is logged for security audit
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedBy = req.admin!;

    // Prevent self-deletion
    if (id === deletedBy.id) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete your own Super Admin account'
      });
      return;
    }

    // Check if the target admin exists and is a Super Admin
    const { data: targetAdmin, error: fetchError } = await supabaseAdmin
      .from('admins')
      .select('id, email, firstName, lastName, role')
      .eq('id', id)
      .eq('role', 'Super Admin')
      .single();

    if (fetchError || !targetAdmin) {
      res.status(404).json({
        success: false,
        error: 'Super Admin not found'
      });
      return;
    }

    // Count total number of Super Admins
    const { count: superAdminCount, error: countError } = await supabaseAdmin
      .from('admins')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'Super Admin')
      .eq('isActive', true);

    if (countError) {
      console.error('Database error counting Super Admins:', countError);
      res.status(500).json({
        success: false,
        error: 'Failed to verify Super Admin count',
        details: countError.message
      });
      return;
    }

    // Prevent deletion of the last Super Admin
    if ((superAdminCount || 0) <= 1) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete the last remaining Super Admin. At least one Super Admin must exist.'
      });
      return;
    }

    // Perform the deletion
    const { error: deleteError } = await supabaseAdmin
      .from('admins')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Database error deleting Super Admin:', deleteError);
      res.status(500).json({
        success: false,
        error: 'Failed to delete Super Admin',
        details: deleteError.message
      });
      return;
    }

    // Log the deletion action for security audit
    console.log(`Super Admin deleted: ${targetAdmin.email} (${targetAdmin.id}) by ${deletedBy.email} at ${new Date().toISOString()}`);

    // Optionally, save to audit log table if you have one
    try {
      await supabaseAdmin
        .from('notification_logs')
        .insert({
          id: uuidv4(),
          type: 'admin_action',
          recipient: 'system',
          message: `Super Admin ${targetAdmin.email} deleted by ${deletedBy.email}`,
          status: 'sent',
          admin_id: deletedBy.id,
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Failed to log deletion action:', logError);
      // Don't fail the request if logging fails
    }

    res.json({
      success: true,
      message: `Super Admin ${targetAdmin.firstName} ${targetAdmin.lastName} deleted successfully`,
      data: {
        deletedAdmin: {
          id: targetAdmin.id,
          email: targetAdmin.email,
          firstName: targetAdmin.firstName,
          lastName: targetAdmin.lastName
        },
        deletedBy: {
          id: deletedBy.id,
          email: deletedBy.email
        },
        deletedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error deleting Super Admin:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/super-admins
 * Get all Super Admins
 */
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { data: superAdmins, error } = await supabaseAdmin
      .from('admins')
      .select(`
        id,
        email,
        phone,
        firstName,
        lastName,
        role,
        status,
        isActive,
        isVerified,
        createdAt,
        lastLogin,
        invitedBy
      `)
      .eq('role', 'Super Admin')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Database error fetching Super Admins:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch Super Admins',
        details: error.message
      });
      return;
    }

    res.json({
      success: true,
      data: superAdmins || [],
      meta: {
        total: superAdmins?.length || 0
      }
    });

  } catch (error) {
    console.error('Error fetching Super Admins:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/super-admins/:id/status
 * Update Super Admin status (activate/deactivate)
 */
router.put('/:id/status', validateRequest(updateSuperAdminSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedBy = req.admin!;

    // Prevent self-deactivation
    if (id === updatedBy.id && status === 'DEACTIVATED') {
      res.status(400).json({
        success: false,
        error: 'Cannot deactivate your own Super Admin account'
      });
      return;
    }

    // Check if target is a Super Admin
    const { data: targetAdmin, error: fetchError } = await supabaseAdmin
      .from('admins')
      .select('id, email, firstName, lastName, role, status')
      .eq('id', id)
      .eq('role', 'Super Admin')
      .single();

    if (fetchError || !targetAdmin) {
      res.status(404).json({
        success: false,
        error: 'Super Admin not found'
      });
      return;
    }

    // Update the status
    const { data: updatedAdmin, error: updateError } = await supabaseAdmin
      .from('admins')
      .update({ 
        status,
        isActive: status === 'ACTIVE',
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        id,
        email,
        firstName,
        lastName,
        role,
        status,
        isActive,
        updatedAt
      `)
      .single();

    if (updateError) {
      console.error('Database error updating Super Admin status:', updateError);
      res.status(500).json({
        success: false,
        error: 'Failed to update Super Admin status',
        details: updateError.message
      });
      return;
    }

    // Log the status change
    console.log(`Super Admin status updated: ${targetAdmin.email} status changed to ${status} by ${updatedBy.email} at ${new Date().toISOString()}`);

    res.json({
      success: true,
      message: `Super Admin status updated to ${status}`,
      data: updatedAdmin
    });

  } catch (error) {
    console.error('Error updating Super Admin status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
