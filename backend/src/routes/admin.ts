import { Router, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { summaryService } from '../services/summaryService';
import { notificationService } from '../services/notificationService';
import { triggerDailySummary } from '../services/scheduler';
import { authenticateAdmin, requireAnyAdminRole, requireAdminOrAbove, requireSuperAdmin, AuthenticatedRequest } from '../middleware/auth';
import { validateRequest, updateReportSchema } from '../middleware/validation';
import { UpdateReportRequest } from '../types';

const router = Router();

// All admin routes require authentication
router.use(authenticateAdmin);

// GET /api/admin/reports - Get all reports (admin view with sensitive data)
router.get('/reports', requireAnyAdminRole, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { 
      page = '1', 
      limit = '20', 
      status, 
      category, 
      priority,
      assignedTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build query with admin-specific fields
    let query = supabaseAdmin
      .from('reports')
      .select(`
        *,
        assignedAdmin:assignedTo(
          id,
          firstName,
          lastName,
          email
        )
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

    if (assignedTo) {
      query = query.eq('assignedTo', assignedTo);
    }

    if (search) {
      query = query.or(`description.ilike.%${search}%,address.ilike.%${search}%,adminNotes.ilike.%${search}%`);
    }

    // Apply sorting
    const validSortFields = ['createdAt', 'updatedAt', 'status', 'priority', 'category'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? { ascending: true } : { ascending: false };

    query = query
      .order(sortField, sortDirection)
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
    console.error('Error fetching admin reports:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/admin/reports/:id - Update a report
router.put('/reports/:id', requireAnyAdminRole, validateRequest(updateReportSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateReportRequest = req.body;
    const adminId = req.admin!.id;
    const adminName = `${req.admin!.email}`;

    // Check if report exists
    const { data: existingReport, error: fetchError } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingReport) {
      res.status(404).json({
        success: false,
        error: 'Report not found'
      });
      return;
    }

    // Prepare update data
    const updatePayload = {
      ...updateData,
      updatedAt: new Date().toISOString(),
      updatedBy: adminId
    };

    // Update report
    const { data: updatedReport, error: updateError } = await supabaseAdmin
      .from('reports')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Database error:', updateError);
      res.status(500).json({
        success: false,
        error: 'Failed to update report',
        details: updateError.message
      });
      return;
    }

    // Send notification if status changed
    if (updateData.status && updateData.status !== existingReport.status) {
      try {
        await notificationService.sendStatusUpdateAlert(
          id,
          updateData.status,
          adminName
        );
      } catch (notificationError) {
        console.error('Failed to send status update notification:', notificationError);
        // Don't fail the request if notification fails
      }
    }

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: updatedReport
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/admin/reports/:id - Delete a report (Super Admin only)
router.delete('/reports/:id', requireSuperAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete report',
        details: error.message
      });
      return;
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/admin/dashboard/stats - Get dashboard statistics
router.get('/dashboard/stats', requireAnyAdminRole, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Get all reports for statistics
    const { data: allReports, error } = await supabaseAdmin
      .from('reports')
      .select('*');

    if (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics',
        details: error.message
      });
      return;
    }

    const reports = allReports || [];

    // Calculate statistics
    const totalReports = reports.length;
    const pendingReports = reports.filter(r => r.status === 'Pending').length;
    const inProgressReports = reports.filter(r => r.status === 'In Progress').length;
    const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
    const rejectedReports = reports.filter(r => r.status === 'Rejected').length;

    // Today's reports
    const today = new Date().toISOString().split('T')[0];
    const todayReports = reports.filter(r => r.createdAt.startsWith(today));

    // This week's reports
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekReports = reports.filter(r => new Date(r.createdAt) >= weekAgo);

    // Critical reports
    const criticalReports = reports.filter(r => r.priority === 'Critical');

    // Reports by category
    const reportsByCategory = reports.reduce((acc, report) => {
      const category = report.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Completion rate
    const completionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

    const stats = {
      overview: {
        totalReports,
        pendingReports,
        inProgressReports,
        resolvedReports,
        rejectedReports,
        completionRate
      },
      timeBasedStats: {
        todayReports: todayReports.length,
        thisWeekReports: thisWeekReports.length
      },
      priorityBreakdown: {
        low: reports.filter(r => r.priority === 'Low').length,
        medium: reports.filter(r => r.priority === 'Medium').length,
        high: reports.filter(r => r.priority === 'High').length,
        critical: criticalReports.length
      },
      categoryBreakdown: reportsByCategory,
      criticalAlerts: {
        count: criticalReports.length,
        reports: criticalReports.slice(0, 5) // Latest 5 critical reports
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/admin/admins - Get all admins (Super Admin only)
router.get('/admins', requireSuperAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { data: admins, error } = await supabaseAdmin
      .from('admins')
      .select(`
        id,
        email,
        firstName,
        lastName,
        role,
        isActive,
        isVerified,
        createdAt,
        lastLogin,
        invitedBy
      `)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch admins',
        details: error.message
      });
      return;
    }

    res.json({
      success: true,
      data: admins || []
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/admin/admins/:id/status - Update admin status (Super Admin only)
router.put('/admins/:id/status', requireSuperAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      res.status(400).json({
        success: false,
        error: 'isActive must be a boolean value'
      });
      return;
    }

    // Prevent super admin from deactivating themselves
    if (id === req.admin!.id && !isActive) {
      res.status(400).json({
        success: false,
        error: 'Cannot deactivate your own account'
      });
      return;
    }

    const { data: updatedAdmin, error } = await supabaseAdmin
      .from('admins')
      .update({ 
        isActive,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, email, firstName, lastName, isActive')
      .single();

    if (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update admin status',
        details: error.message
      });
      return;
    }

    res.json({
      success: true,
      message: `Admin ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedAdmin
    });
  } catch (error) {
    console.error('Error updating admin status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/admin/daily-summary/trigger - Manually trigger daily summary (Admin+)
router.post('/daily-summary/trigger', requireAdminOrAbove, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { date } = req.body;
    
    await triggerDailySummary(date);
    
    res.json({
      success: true,
      message: `Daily summary triggered successfully for ${date || 'today'}`
    });
  } catch (error) {
    console.error('Error triggering daily summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger daily summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/admin/daily-summaries - Get daily summaries (Admin+)
router.get('/daily-summaries', requireAdminOrAbove, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, limit = '30' } = req.query;

    let summaries;
    
    if (startDate && endDate) {
      summaries = await summaryService.getDailySummariesByDateRange(
        startDate as string,
        endDate as string
      );
    } else {
      // Get last N summaries
      const limitNumber = parseInt(limit as string, 10);
      const { data, error } = await supabaseAdmin
        .from('daily_summaries')
        .select('*')
        .order('date', { ascending: false })
        .limit(limitNumber);

      if (error) {
        throw new Error(error.message);
      }

      summaries = data;
    }

    res.json({
      success: true,
      data: summaries || []
    });
  } catch (error) {
    console.error('Error fetching daily summaries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch daily summaries',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
