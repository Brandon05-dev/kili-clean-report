import OpenAI from 'openai';
import { MultiChannelAlertService } from './multiChannelAlert';
import { ReportService } from './reportService';

export interface DailySummaryData {
  totalReports: number;
  newReports: number;
  pendingReports: number;
  resolvedReports: number;
  topIssues: Array<{ type: string; count: number }>;
  topLocations: Array<{ name: string; count: number }>;
  criticalReports: any[];
  aiInsights?: string;
  date: string;
}

export class DailySummaryService {
  private openai: OpenAI;
  private alertService: MultiChannelAlertService;
  private reportService: ReportService;

  constructor(alertService: MultiChannelAlertService, reportService: ReportService) {
    this.alertService = alertService;
    this.reportService = reportService;
    
    // Initialize OpenAI if API key is provided
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: openaiApiKey
      });
    }
  }

  /**
   * 📊 Generate and send daily summary
   */
  async generateAndSendDailySummary(): Promise<void> {
    try {
      console.log('📊 Starting daily summary generation...');
      
      // Get today's date
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      // Fetch all reports for today
      const todaysReports = await this.reportService.getReportsByDateRange(startOfDay, endOfDay);
      
      // Generate summary data
      const summaryData = await this.generateSummaryData(todaysReports, today);
      
      // Add AI insights if OpenAI is available
      if (this.openai) {
        summaryData.aiInsights = await this.generateAIInsights(todaysReports);
      }
      
      // Send multi-channel summary (WhatsApp + SMS)
      const deliveryResults = await this.alertService.sendDailySummary(summaryData);
      
      // Log results
      const totalSent = deliveryResults.totalSent;
      const totalFailed = deliveryResults.totalFailed;
      
      console.log(`📱 Daily summary delivery: ${totalSent} sent, ${totalFailed} failed`);
      
      // Save summary to database for records
      await this.reportService.saveDailySummary(summaryData, deliveryResults);
      
    } catch (error) {
      console.error('❌ Error generating daily summary:', error);
      throw error;
    }
  }

  /**
   * 📈 Generate summary statistics from reports
   */
  private async generateSummaryData(reports: any[], date: Date): Promise<DailySummaryData> {
    const totalReports = reports.length;
    const newReports = reports.filter(r => r.status === 'new' || r.status === 'pending').length;
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const resolvedReports = reports.filter(r => r.status === 'resolved' || r.status === 'completed').length;
    
    // Analyze issue types
    const issueTypes = new Map<string, number>();
    reports.forEach(report => {
      const type = this.categorizeIssue(report.description);
      issueTypes.set(type, (issueTypes.get(type) || 0) + 1);
    });
    
    const topIssues = Array.from(issueTypes.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Analyze locations
    const locations = new Map<string, number>();
    reports.forEach(report => {
      if (report.location) {
        const location = report.location.trim();
        locations.set(location, (locations.get(location) || 0) + 1);
      }
    });
    
    const topLocations = Array.from(locations.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Get critical/urgent reports
    const criticalReports = reports
      .filter(report => this.isCriticalReport(report))
      .slice(0, 5);
    
    return {
      totalReports,
      newReports,
      pendingReports,
      resolvedReports,
      topIssues,
      topLocations,
      criticalReports,
      date: date.toISOString().split('T')[0]
    };
  }

  /**
   * 🤖 Generate AI insights using OpenAI
   */
  private async generateAIInsights(reports: any[]): Promise<string> {
    try {
      if (!this.openai || reports.length === 0) {
        return 'No AI insights available';
      }

      // Prepare data for AI analysis
      const reportSummaries = reports.map(report => ({
        location: report.location,
        description: report.description?.substring(0, 100),
        status: report.status,
        timestamp: report.createdAt
      }));

      const prompt = `
Analyze the following environmental reports from CleanKili for today and provide brief insights:

Reports: ${JSON.stringify(reportSummaries, null, 2)}

Please provide:
1. Main environmental trends or patterns
2. Areas that need immediate attention
3. Recommendations for action
4. Any concerning patterns

Keep response under 200 words and focus on actionable insights.
`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      });

      return completion.choices[0]?.message?.content || 'AI analysis unavailable';
      
    } catch (error) {
      console.error('❌ Error generating AI insights:', error);
      return 'AI insights temporarily unavailable';
    }
  }

  /**
   * 🏷️ Categorize issue based on description
   */
  private categorizeIssue(description: string): string {
    if (!description) return 'Other';
    
    const desc = description.toLowerCase();
    
    if (desc.includes('garbage') || desc.includes('waste') || desc.includes('trash') || desc.includes('litter')) {
      return 'Garbage/Waste';
    }
    if (desc.includes('water') || desc.includes('drainage') || desc.includes('flood') || desc.includes('sewage')) {
      return 'Water/Drainage';
    }
    if (desc.includes('road') || desc.includes('pothole') || desc.includes('street') || desc.includes('path')) {
      return 'Road/Infrastructure';
    }
    if (desc.includes('tree') || desc.includes('vegetation') || desc.includes('green') || desc.includes('plant')) {
      return 'Vegetation';
    }
    if (desc.includes('air') || desc.includes('pollution') || desc.includes('smoke') || desc.includes('smell')) {
      return 'Air Quality';
    }
    if (desc.includes('noise') || desc.includes('loud') || desc.includes('sound')) {
      return 'Noise Pollution';
    }
    if (desc.includes('building') || desc.includes('structure') || desc.includes('construction')) {
      return 'Buildings/Construction';
    }
    
    return 'Other';
  }

  /**
   * 🚨 Determine if report is critical/urgent
   */
  private isCriticalReport(report: any): boolean {
    if (!report.description) return false;
    
    const desc = report.description.toLowerCase();
    const criticalKeywords = [
      'emergency', 'urgent', 'dangerous', 'hazardous', 'toxic', 
      'flooding', 'overflow', 'blocked', 'major', 'serious',
      'health risk', 'safety', 'contamination', 'leak'
    ];
    
    return criticalKeywords.some(keyword => desc.includes(keyword));
  }

  /**
   * 📊 Generate summary for specific date (for testing or historical data)
   */
  async generateSummaryForDate(date: Date): Promise<DailySummaryData> {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const reports = await this.reportService.getReportsByDateRange(startOfDay, endOfDay);
    const summaryData = await this.generateSummaryData(reports, date);
    
    if (this.openai) {
      summaryData.aiInsights = await this.generateAIInsights(reports);
    }
    
    return summaryData;
  }
}
