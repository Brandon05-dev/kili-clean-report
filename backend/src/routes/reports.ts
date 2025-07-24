import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase, supabaseAdmin } from '../config/supabase';
import { notificationService } from '../services/notificationService';
import { validateRequest, createReportSchema } from '../middleware/validation';
import { CreateReportRequest, Report } from '../types';

const router = Router();

// POST /api/reports - Create a new report
router.post('/', validateRequest(createReportSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const reportData: CreateReportRequest = req.body;
    
    const newReport = {
      id: uuidv4(),
      description: reportData.description,
      photoUrl: reportData.photoUrl || null,
      lat: reportData.lat,
      lng: reportData.lng,
      status: 'Pending' as const,
      category: reportData.category || 'Other',
      reporterEmail: reportData.reporterEmail || null,
      reporterPhone: reportData.reporterPhone || null,
      address: reportData.address || null,
      priority: 'Medium' as const,
      createdAt: new Date().toISOString()
    };

    // Insert report into database
    const { data: insertedReport, error } = await supabaseAdmin
      .from('reports')
      .insert(newReport)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create report',
        details: error.message
      });
      return;
    }

    // Send immediate notification to admins
    try {
      const locationText = reportData.address || `${reportData.lat}, ${reportData.lng}`;
      await notificationService.sendNewReportAlert(
        newReport.id,
        reportData.description,
        locationText
      );
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: insertedReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/reports - Get all public reports (with pagination and filtering)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = '1', 
      limit = '20', 
      status, 
      category, 
      priority,
      search,
      lat,
      lng,
      radius // in kilometers
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build query
    let query = supabase
      .from('reports')
      .select(`
        id,
        description,
        photoUrl,
        lat,
        lng,
        status,
        category,
        priority,
        address,
        createdAt
      `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    if (search) {
      query = query.or(`description.ilike.%${search}%,address.ilike.%${search}%`);
    }

    // Location-based filtering (simplified - for production, use PostGIS)
    if (lat && lng && radius) {
      const centerLat = parseFloat(lat as string);
      const centerLng = parseFloat(lng as string);
      const radiusKm = parseFloat(radius as string);
      
      // Rough approximation: 1 degree ≈ 111km
      const latRange = radiusKm / 111;
      const lngRange = radiusKm / (111 * Math.cos(centerLat * Math.PI / 180));
      
      query = query
        .gte('lat', centerLat - latRange)
        .lte('lat', centerLat + latRange)
        .gte('lng', centerLng - lngRange)
        .lte('lng', centerLng + lngRange);
    }

    // Order and paginate
    query = query
      .order('createdAt', { ascending: false })
      .range(offset, offset + limitNumber - 1);

    const { data: reports, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reports',
        details: error.message
      });
      return;
    }

    const totalPages = Math.ceil((count || 0) / limitNumber);

    res.json({
      success: true,
      data: {
        reports: reports || [],
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalCount: count || 0,
          hasNextPage: pageNumber < totalPages,
          hasPreviousPage: pageNumber > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/reports/:id - Get a specific report by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data: report, error } = await supabase
      .from('reports')
      .select(`
        id,
        description,
        photoUrl,
        lat,
        lng,
        status,
        category,
        priority,
        address,
        createdAt,
        updatedAt
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({
          success: false,
          error: 'Report not found'
        });
        return;
      }

      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch report',
        details: error.message
      });
      return;
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/reports/stats/summary - Get public statistics
router.get('/stats/summary', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: stats, error } = await supabase
      .from('reports')
      .select('status, category, priority')
      .not('status', 'eq', 'Rejected'); // Exclude rejected reports from public stats

    if (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics',
        details: error.message
      });
      return;
    }

    const summary = {
      total: stats?.length || 0,
      byStatus: {
        pending: stats?.filter(r => r.status === 'Pending').length || 0,
        inProgress: stats?.filter(r => r.status === 'In Progress').length || 0,
        resolved: stats?.filter(r => r.status === 'Resolved').length || 0
      },
      byCategory: {} as Record<string, number>,
      byPriority: {
        low: stats?.filter(r => r.priority === 'Low').length || 0,
        medium: stats?.filter(r => r.priority === 'Medium').length || 0,
        high: stats?.filter(r => r.priority === 'High').length || 0,
        critical: stats?.filter(r => r.priority === 'Critical').length || 0
      }
    };

    // Count by category
    stats?.forEach(report => {
      const category = report.category || 'Other';
      summary.byCategory[category] = (summary.byCategory[category] || 0) + 1;
    });

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching report statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
