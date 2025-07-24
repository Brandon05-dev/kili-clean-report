import { supabaseAdmin } from '../config/supabase';
import { DailySummary, Report } from '../types';

// Mock AI service without OpenAI dependency

export class SummaryService {
  private static instance: SummaryService;
  
  public static getInstance(): SummaryService {
    if (!SummaryService.instance) {
      SummaryService.instance = new SummaryService();
    }
    return SummaryService.instance;
  }

  async generateDailySummary(date?: string): Promise<DailySummary> {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      console.log(`📊 Generating daily summary for ${targetDate}`);

      const startOfDay = `${date}T00:00:00.000Z`;
      const endOfDay = `${date}T23:59:59.999Z`;

      // Get all reports for the day
      const { data: reports, error: reportsError } = await supabaseAdmin
        .from('reports')
        .select('*')
        .gte('createdAt', startOfDay)
        .lte('createdAt', endOfDay);

      if (reportsError) {
        throw new Error(`Failed to fetch reports: ${reportsError.message}`);
      }

      const reportsData = reports || [];

      // Calculate summary statistics
      const totalReports = reportsData.length;
      const pendingReports = reportsData.filter(r => r.status === 'Pending').length;
      const inProgressReports = reportsData.filter(r => r.status === 'In Progress').length;
      const resolvedReports = reportsData.filter(r => r.status === 'Resolved').length;
      const rejectedReports = reportsData.filter(r => r.status === 'Rejected').length;

      // Get top locations (simplified - group by approximate coordinates)
      const locationMap = new Map<string, { count: number; lat: number; lng: number; area: string }>();
      
      reportsData.forEach(report => {
        // Round coordinates to group nearby reports
        const roundedLat = Math.round(report.lat * 100) / 100;
        const roundedLng = Math.round(report.lng * 100) / 100;
        const key = `${roundedLat},${roundedLng}`;
        
        if (locationMap.has(key)) {
          locationMap.get(key)!.count++;
        } else {
          locationMap.set(key, {
            count: 1,
            lat: report.lat,
            lng: report.lng,
            area: report.address || `${roundedLat}, ${roundedLng}`
          });
        }
      });

      const topLocations = Array.from(locationMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get top categories
      const categoryMap = new Map<string, number>();
      reportsData.forEach(report => {
        const category = report.category || 'Other';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      const topCategories = Array.from(categoryMap.entries())
        .map(([category, count]) => ({ category: category as any, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get critical reports (high priority)
      const criticalReports = reportsData.filter(r => r.priority === 'Critical');

      const summary: DailySummary = {
        date: targetDate,
        totalReports,
        pendingReports,
        inProgressReports,
        resolvedReports,
        rejectedReports,
        topLocations,
        topCategories,
        criticalReports
      };

      console.log(`✅ Daily summary generated: ${totalReports} total reports`);
      return summary;

    } catch (error) {
      console.error('❌ Error generating daily summary:', error);
      throw error;
    }
  }

  async generateAISummary(dailySummary: DailySummary): Promise<string> {
    console.log('🤖 Using template summary (OpenAI disabled)');
    return this.generateTemplateSummary(dailySummary);
  }

  private generateTemplateSummary(summary: DailySummary): string {
    const { 
      date, 
      totalReports, 
      pendingReports, 
      inProgressReports, 
      resolvedReports,
      rejectedReports,
      topLocations,
      topCategories,
      criticalReports 
    } = summary;

    let summaryText = `📊 CleanKili Daily Report - ${date}\n\n`;
    
    summaryText += `📈 OVERVIEW:\n`;
    summaryText += `Total Reports: ${totalReports}\n`;
    summaryText += `Pending: ${pendingReports}\n`;
    summaryText += `In Progress: ${inProgressReports}\n`;
    summaryText += `Resolved: ${resolvedReports}\n`;
    summaryText += `Rejected: ${rejectedReports}\n\n`;

    if (topLocations.length > 0) {
      summaryText += `📍 TOP LOCATIONS:\n`;
      topLocations.forEach((loc, index) => {
        summaryText += `${index + 1}. ${loc.area}: ${loc.count} reports\n`;
      });
      summaryText += '\n';
    }

    if (topCategories.length > 0) {
      summaryText += `🏷️ TOP CATEGORIES:\n`;
      topCategories.forEach((cat, index) => {
        summaryText += `${index + 1}. ${cat.category}: ${cat.count} reports\n`;
      });
      summaryText += '\n';
    }

    if (criticalReports.length > 0) {
      summaryText += `🚨 CRITICAL ALERTS: ${criticalReports.length} urgent reports require immediate attention\n\n`;
    }

    const completionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;
    summaryText += `✅ Completion Rate: ${completionRate}%\n`;

    if (pendingReports > 0) {
      summaryText += `⚠️ Action Required: ${pendingReports} reports pending review`;
    }

    return summaryText;
  }

  async saveDailySummary(summary: DailySummary, aiSummary: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('daily_summaries')
        .upsert({
          date: summary.date,
          total_reports: summary.totalReports,
          pending_reports: summary.pendingReports,
          in_progress_reports: summary.inProgressReports,
          resolved_reports: summary.resolvedReports,
          rejected_reports: summary.rejectedReports,
          top_locations: summary.topLocations,
          top_categories: summary.topCategories,
          critical_reports_count: summary.criticalReports.length,
          ai_summary: aiSummary,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'date'
        });

      if (error) {
        throw new Error(`Failed to save daily summary: ${error.message}`);
      }

      console.log(`💾 Daily summary saved to database for ${summary.date}`);
    } catch (error) {
      console.error('❌ Error saving daily summary:', error);
      throw error;
    }
  }

  async getDailySummariesByDateRange(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('daily_summaries')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch daily summaries: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('❌ Error fetching daily summaries:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const summaryService = SummaryService.getInstance();
