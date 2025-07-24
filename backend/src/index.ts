import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import reportsRouter from './routes/reports';
import adminRouter from './routes/admin';
import superAdminRouter from './routes/superAdmin';
import { MultiChannelAlertService } from './services/multiChannelAlert';
import { DailySummaryService } from './services/dailySummary';
import { ReportService } from './services/reportService';
import { firebaseConfig } from './config/firebase';

// Load environment variables
dotenv.config();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Express
const server = express();
const PORT = process.env.PORT || 3000;

// Middleware
server.use(cors());
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize services
const alertService = new MultiChannelAlertService();
const reportService = new ReportService();
const dailySummaryService = new DailySummaryService(alertService, reportService);

// Routes
server.use('/api/reports', reportsRouter);
server.use('/api/admin', adminRouter);
server.use('/api/super-admin', superAdminRouter);

// Health check endpoint
server.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'CleanKili Backend'
  });
});

// 📌 SCHEDULED CRON JOB: Daily Summary at 11:59 PM
cron.schedule('59 23 * * *', async () => {
  console.log('🕐 Running daily summary cron job at 11:59 PM...');
  try {
    await dailySummaryService.generateAndSendDailySummary();
    console.log('✅ Daily summary sent successfully');
  } catch (error) {
    console.error('❌ Error sending daily summary:', error);
  }
}, {
  scheduled: true,
  timezone: "Africa/Nairobi" // Adjust timezone as needed
});

// Test endpoint for daily summary (for development)
server.post('/api/test-daily-summary', async (req, res) => {
  try {
    await dailySummaryService.generateAndSendDailySummary();
    res.json({ success: true, message: 'Daily summary sent successfully' });
  } catch (error) {
    console.error('Error in test daily summary:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test endpoint for multi-channel connectivity
server.post('/api/test-connectivity', async (req, res) => {
  try {
    const results = await alertService.testConnectivity();
    res.json({ 
      success: true, 
      results,
      message: `WhatsApp: ${results.whatsapp ? 'OK' : 'Failed'}, SMS: ${results.sms ? 'OK' : 'Failed'}`
    });
  } catch (error) {
    console.error('Error in connectivity test:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test endpoint for multi-channel alert
server.post('/api/test-alert', async (req, res) => {
  try {
    const testReport = {
      id: 'test-' + Date.now(),
      location: 'Test Location - Nairobi CBD',
      description: 'This is a test alert for multi-channel notification system',
      status: 'pending',
      priority: 'high',
      coordinates: { lat: -1.2864, lng: 36.8172 },
      photoUrl: 'https://example.com/test-photo.jpg',
      createdAt: new Date()
    };
    
    const results = await alertService.sendMultiChannelAlert(testReport);
    res.json({ 
      success: true, 
      results,
      message: `Alert sent: ${results.totalSent} successful, ${results.totalFailed} failed`
    });
  } catch (error) {
    console.error('Error in test alert:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 CleanKili Backend running on port ${PORT}`);
  console.log(`📱 WhatsApp alerts enabled`);
  console.log(`📊 Daily summary scheduled at 11:59 PM`);
});

export default server;
