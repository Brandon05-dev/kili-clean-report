import express from 'express';
import { AdminService } from '../services/adminService';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const adminService = new AdminService();

// Validation middleware
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Valid phone number with country code is required (e.g., +254700000000)'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('recaptchaToken')
    .notEmpty()
    .withMessage('reCAPTCHA verification is required')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

/**
 * 👤 POST /api/admin/register - Register new admin
 */
router.post('/register', validateRegistration, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, phone, password, recaptchaToken } = req.body;

    const result = await adminService.registerAdmin({
      name,
      email,
      phone,
      password,
      recaptchaToken
    });

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('❌ Error in admin registration:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

/**
 * 🔐 POST /api/admin/login - Admin login
 */
router.post('/login', validateLogin, async (req, res) => {
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
    const result = await adminService.loginAdmin(email, password);

    if (result.success) {
      res.json(result);
    } else {
      res.status(401).json(result);
    }

  } catch (error) {
    console.error('❌ Error in admin login:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

/**
 * ✉️ GET /api/admin/verify-email - Verify email address
 */
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Verification token is required'
      });
    }

    const result = await adminService.verifyEmail(token);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('❌ Error in email verification:', error);
    res.status(500).json({
      success: false,
      error: 'Email verification failed'
    });
  }
});

/**
 * 📱 POST /api/admin/verify-phone - Verify phone number
 */
router.post('/verify-phone', [
  body('phone').matches(/^\+[1-9]\d{1,14}$/).withMessage('Valid phone number is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('6-digit code is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { phone, code } = req.body;
    const result = await adminService.verifyPhone(phone, code);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('❌ Error in phone verification:', error);
    res.status(500).json({
      success: false,
      error: 'Phone verification failed'
    });
  }
});

/**
 * 📧 POST /api/admin/resend-email - Resend email verification
 */
router.post('/resend-email', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email } = req.body;
    const result = await adminService.resendEmailVerification(email);

    res.json(result);

  } catch (error) {
    console.error('❌ Error resending email verification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resend email verification'
    });
  }
});

/**
 * 📱 POST /api/admin/resend-sms - Resend SMS verification
 */
router.post('/resend-sms', [
  body('phone').matches(/^\+[1-9]\d{1,14}$/).withMessage('Valid phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { phone } = req.body;
    const result = await adminService.resendPhoneVerification(phone);

    res.json(result);

  } catch (error) {
    console.error('❌ Error resending SMS verification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resend SMS verification'
    });
  }
});

/**
 * 👥 GET /api/admin/active - Get all active admins (protected route)
 */
router.get('/active', async (req, res) => {
  try {
    // Simple token check (you might want to use proper middleware)
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required'
      });
    }

    const tokenResult = adminService.verifyToken(token);
    if (!tokenResult.valid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid authorization token'
      });
    }

    const activeAdmins = await adminService.getActiveAdmins();
    
    // Remove sensitive information
    const sanitizedAdmins = activeAdmins.map(admin => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      status: admin.status,
      createdAt: admin.createdAt,
      lastLogin: admin.lastLogin
    }));

    res.json({
      success: true,
      data: sanitizedAdmins,
      count: sanitizedAdmins.length
    });

  } catch (error) {
    console.error('❌ Error getting active admins:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get active admins'
    });
  }
});

/**
 * 🔑 POST /api/admin/verify-token - Verify JWT token
 */
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }

    const result = adminService.verifyToken(token);
    
    res.json({
      success: result.valid,
      message: result.valid ? 'Token is valid' : 'Token is invalid',
      adminId: result.adminId,
      error: result.error
    });

  } catch (error) {
    console.error('❌ Error verifying token:', error);
    res.status(500).json({
      success: false,
      error: 'Token verification failed'
    });
  }
});

export default router;
