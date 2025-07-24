import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { ReportService } from '../services/reportService';

const router = express.Router();
const reportService = new ReportService();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/**
 * 📝 POST /api/reports - Create a new report
 */
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const {
      location,
      description,
      coordinates,
      priority = 'medium',
      reportedBy
    } = req.body;

    // Validate required fields
    if (!location || !description) {
      return res.status(400).json({
        success: false,
        error: 'Location and description are required'
      });
    }

    // Parse coordinates if provided
    let parsedCoordinates;
    if (coordinates) {
      try {
        parsedCoordinates = typeof coordinates === 'string' 
          ? JSON.parse(coordinates) 
          : coordinates;
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid coordinates format'
        });
      }
    }

    // Handle photo upload (in production, upload to cloud storage)
    let photoUrl;
    if (req.file) {
      // For demo purposes, we'll create a placeholder URL
      // In production, upload to Firebase Storage, AWS S3, or Cloudinary
      photoUrl = `https://cleankili.app/uploads/${uuidv4()}.jpg`;
      console.log(`📸 Photo uploaded: ${req.file.originalname} (${req.file.size} bytes)`);
    }

    // Create report data
    const reportData = {
      location: location.trim(),
      description: description.trim(),
      coordinates: parsedCoordinates,
      photoUrl,
      priority,
      reportedBy,
      status: 'new' as const
    };

    // Create report (this will also trigger WhatsApp alert)
    const reportId = await reportService.createReport(reportData);

    res.status(201).json({
      success: true,
      data: {
        id: reportId,
        message: 'Report created successfully and WhatsApp alert sent'
      }
    });

  } catch (error) {
    console.error('❌ Error creating report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create report'
    });
  }
});

/**
 * 📋 GET /api/reports - Get all reports with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      status, 
      priority,
      search 
    } = req.query;

    let reports;

    // Handle search
    if (search) {
      reports = await reportService.searchReports(search as string);
    }
    // Handle date range
    else if (startDate && endDate) {
      reports = await reportService.getReportsByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
    }
    // Get all reports
    else {
      reports = await reportService.getAllReports();
    }

    // Apply additional filters
    if (status) {
      reports = reports.filter(report => report.status === status);
    }
    if (priority) {
      reports = reports.filter(report => report.priority === priority);
    }

    res.json({
      success: true,
      data: reports,
      count: reports.length
    });

  } catch (error) {
    console.error('❌ Error fetching reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports'
    });
  }
});

/**
 * 📄 GET /api/reports/:id - Get a specific report
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const report = await reportService.getReportById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('❌ Error fetching report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch report'
    });
  }
});

/**
 * ✏️ PATCH /api/reports/:id/status - Update report status
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const validStatuses = ['new', 'pending', 'in-progress', 'resolved', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    await reportService.updateReportStatus(id, status, assignedTo);

    res.json({
      success: true,
      message: 'Report status updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating report status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update report status'
    });
  }
});

/**
 * 🗑️ DELETE /api/reports/:id - Delete a report
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await reportService.deleteReport(id);

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete report'
    });
  }
});

/**
 * 📈 GET /api/reports/stats - Get reports statistics
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await reportService.getReportsStatistics();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

export default router;
