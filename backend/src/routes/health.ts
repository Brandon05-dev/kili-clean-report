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
    if (process.env.NODE_ENV === 'development' && req.query.test_notifications === 'true') {
      notificationTest = await notificationService.testNotificationService();
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

export default router;
