import { Router, Request, Response } from 'express';
import { testConnection } from '../config/supabase';
import { notificationService } from '../services/notificationService';

const router = Router();

// Health check endpoint
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const dbConnection = await testConnection();
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbConnection ? 'connected' : 'disconnected',
        notifications: {
          twilio: 'disabled',
          openai: 'disabled'
        }
      },
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };

    const statusCode = dbConnection ? 200 : 503;
    
    res.status(statusCode).json({
      success: true,
      data: healthStatus
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Detailed health check with service tests
router.get('/detailed', async (req: Request, res: Response): Promise<void> => {
  try {
    const dbConnection = await testConnection();
    
    // Test notification service (only if in development)
    let notificationTest = { sms: false, whatsapp: false };
    let emailTest: { success: boolean; error?: string } = { success: false, error: 'Not tested' };
    
    if (process.env.NODE_ENV === 'development' && req.query.test_notifications === 'true') {
      notificationTest = await notificationService.testNotificationService();
    }

    if (req.query.test_email === 'true') {
      emailTest = await notificationService.testEmailConfiguration();
    }

    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbConnection ? 'connected' : 'disconnected',
          url: process.env.SUPABASE_URL ? 'configured' : 'not configured'
        },
        notifications: {
          twilio: {
            configured: false,
            sms_test: false,
            whatsapp_test: false
          },
          openai: {
            configured: false
          }
        },
        email: {
          configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
          smtp_host: process.env.SMTP_HOST || 'not configured',
          test_result: emailTest
        }
      },
      environment: {
        node_env: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 5000,
        cors_origin: process.env.CORS_ORIGIN || 'not configured'
      },
      configuration: {
        admin_phones: !!process.env.ADMIN_PHONE_NUMBERS,
        admin_whatsapp: !!process.env.ADMIN_WHATSAPP_NUMBERS,
        jwt_secret: !!process.env.JWT_SECRET
      }
    };

    const allServicesHealthy = dbConnection; // Only check database since other services are disabled
    
    const statusCode = allServicesHealthy ? 200 : 503;
    
    res.status(statusCode).json({
      success: true,
      data: detailedHealth
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: 'Detailed health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Email configuration test endpoint
router.get('/test-email', async (req: Request, res: Response): Promise<void> => {
  try {
    const emailTest = await notificationService.testEmailConfiguration();
    
    res.json({
      success: true,
      data: {
        email_configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
        smtp_host: process.env.SMTP_HOST || 'not configured',
        smtp_port: process.env.SMTP_PORT || 'not configured',
        smtp_user: process.env.SMTP_USER || 'not configured',
        test_result: emailTest
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Email test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Send test email endpoint (for development only)
router.post('/send-test-email', async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') {
    res.status(403).json({
      success: false,
      error: 'Test email endpoint only available in development mode'
    });
    return;
  }

  try {
    const { to, type = 'welcome' } = req.body;
    
    if (!to) {
      res.status(400).json({
        success: false,
        error: 'Email address (to) is required'
      });
      return;
    }

    let result = false;
    
    switch (type) {
      case 'welcome':
        result = await notificationService.sendSuperAdminWelcomeEmail(
          to,
          'Test User',
          'https://example.com/verify?token=test-token'
        );
        break;
      case 'invitation':
        result = await notificationService.sendAdminInvitationEmail(
          to,
          'Test User',
          'https://example.com/complete-invite?token=test-token',
          'Test Admin'
        );
        break;
      case 'password-reset':
        result = await notificationService.sendPasswordResetEmail(
          to,
          'Test User',
          'https://example.com/reset-password?token=test-token'
        );
        break;
      default:
        res.status(400).json({
          success: false,
          error: 'Invalid email type. Use: welcome, invitation, or password-reset'
        });
        return;
    }

    res.json({
      success: true,
      data: {
        email_sent: result,
        to,
        type
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
