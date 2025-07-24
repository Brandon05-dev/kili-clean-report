import express, { Request, Response } from 'express';
import { SuperAdminService } from '../services/superAdminService';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const superAdminService = new SuperAdminService();

// 🔐 Middleware to verify Super Admin authentication
const requireSuperAdmin = async (req: Request, res: Response, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.adminToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        redirectTo: '/'
      });
    }

    const tokenResult = superAdminService.verifyToken(token);
    if (!tokenResult.valid || tokenResult.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Super Admin access required',
        redirectTo: '/'
      });
    }

    req.body.authenticatedAdminId = tokenResult.adminId;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authentication verification failed'
    });
  }
};

// 🔐 Middleware to verify any admin authentication
const requireAdmin = async (req: Request, res: Response, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.adminToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        redirectTo: '/'
      });
    }

    const tokenResult = superAdminService.verifyToken(token);
    if (!tokenResult.valid || (tokenResult.role !== 'ADMIN' && tokenResult.role !== 'SUPER_ADMIN')) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required',
        redirectTo: '/'
      });
    }

    req.body.authenticatedAdminId = tokenResult.adminId;
    req.body.authenticatedAdminRole = tokenResult.role;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authentication verification failed'
    });
  }
};

/**
 * 🔐 POST /api/super-admin/login - Super Admin authentication
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;
    const result = await superAdminService.authenticateSuperAdmin(email, password);

    if (result.success && result.token) {
      // Set secure HTTP-only cookie
      res.cookie('adminToken', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
    }

    res.json(result);

  } catch (error) {
    console.error('❌ Error in super admin login:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

/**
 * 👥 POST /api/super-admin/invite - Invite new admin
 */
router.post('/invite', requireSuperAdmin, [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').matches(/^\+[1-9]\d{1,14}$/).withMessage('Valid phone number with country code is required'),
  body('role').isIn(['ADMIN', 'SUPER_ADMIN']).withMessage('Role must be ADMIN or SUPER_ADMIN')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, phone, role, authenticatedAdminId } = req.body;

    const result = await superAdminService.inviteAdmin(
      { name, email, phone, role },
      authenticatedAdminId
    );

    res.json(result);

  } catch (error) {
    console.error('❌ Error inviting admin:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send invitation'
    });
  }
});

/**
 * 📊 GET /api/super-admin/stats - Get dashboard statistics
 */
router.get('/stats', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const stats = await superAdminService.getSuperAdminStats();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Error getting super admin stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics'
    });
  }
});

/**
 * 👥 GET /api/super-admin/admins - Get all admins
 */
router.get('/admins', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const admins = await superAdminService.getAllAdmins();
    
    res.json({
      success: true,
      data: admins
    });

  } catch (error) {
    console.error('❌ Error getting all admins:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get admin list'
    });
  }
});

/**
 * 🔄 PUT /api/super-admin/admins/:email/status - Update admin status
 */
router.put('/admins/:email/status', requireSuperAdmin, [
  body('status').isIn(['ACTIVE', 'SUSPENDED', 'DEACTIVATED']).withMessage('Invalid status')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email } = req.params;
    const { status, authenticatedAdminId } = req.body;

    const success = await superAdminService.updateAdminStatus(email, status, authenticatedAdminId);
    
    if (success) {
      res.json({
        success: true,
        message: `Admin status updated to ${status}`
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to update admin status'
      });
    }

  } catch (error) {
    console.error('❌ Error updating admin status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update admin status'
    });
  }
});

/**
 * 🗑️ DELETE /api/super-admin/admins/:email - Remove admin
 */
router.delete('/admins/:email', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { authenticatedAdminId } = req.body;

    const success = await superAdminService.removeAdmin(email, authenticatedAdminId);
    
    if (success) {
      res.json({
        success: true,
        message: 'Admin removed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to remove admin'
      });
    }

  } catch (error) {
    console.error('❌ Error removing admin:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove admin'
    });
  }
});

/**
 * ✅ POST /api/super-admin/complete-invite - Complete admin invitation
 */
router.post('/complete-invite', [
  body('invitationToken').notEmpty().withMessage('Invitation token is required'),
  body('phoneOtp').isLength({ min: 6, max: 6 }).withMessage('6-digit OTP is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { invitationToken, phoneOtp, password } = req.body;

    const result = await superAdminService.completeInvitation({
      invitationToken,
      phoneOtp,
      password
    });

    if (result.success && result.token) {
      // Set secure HTTP-only cookie
      res.cookie('adminToken', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
    }

    res.json(result);

  } catch (error) {
    console.error('❌ Error completing invitation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete invitation'
    });
  }
});

/**
 * 🚪 POST /api/super-admin/logout - Logout
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('adminToken');
  res.json({
    success: true,
    message: 'Logged out successfully',
    redirectTo: '/'
  });
});

/**
 * 🔍 GET /api/super-admin/verify-session - Verify current session
 */
router.get('/verify-session', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { authenticatedAdminRole } = req.body;
    
    res.json({
      success: true,
      role: authenticatedAdminRole,
      isSuperAdmin: authenticatedAdminRole === 'SUPER_ADMIN'
    });

  } catch (error) {
    console.error('❌ Error verifying session:', error);
    res.status(500).json({
      success: false,
      error: 'Session verification failed'
    });
  }
});

export default router;
