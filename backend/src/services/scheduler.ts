import cron from 'node-cron';
import { summaryService } from './summaryService';
import { notificationService } from './notificationService';

export const startDailySummaryScheduler = (): void => {
  console.log('🕐 Initializing daily summary scheduler...');

  // Schedule task to run daily at 11:59 PM
  cron.schedule('59 23 * * *', async () => {
    try {
      console.log('⏰ Daily summary scheduler triggered at 11:59 PM');

      const today = new Date().toISOString().split('T')[0];
      
      // Generate daily summary
      const dailySummary = await summaryService.generateDailySummary(today);
      
      // Generate AI-powered summary text
      const aiSummary = await summaryService.generateAISummary(dailySummary);
      
      // Save summary to database
      await summaryService.saveDailySummary(dailySummary, aiSummary);
      
      // Send summary to admins via WhatsApp and SMS
      await notificationService.sendDailySummary(aiSummary);
      
      console.log(`✅ Daily summary completed successfully for ${today}`);
      
    } catch (error) {
      console.error('❌ Error in daily summary scheduler:', error);
      
      // Send error notification to admins
      const errorMessage = `⚠️ CleanKili Daily Summary Failed\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nTime: ${new Date().toLocaleString()}\n\nPlease check server logs.`;
      
      try {
        await notificationService.sendDailySummary(errorMessage);
      } catch (notificationError) {
        console.error('❌ Failed to send error notification:', notificationError);
      }
    }
  }, {
    scheduled: true,
    timezone: "Africa/Nairobi" // Kenya timezone
  });

  console.log('✅ Daily summary scheduler started - will run daily at 11:59 PM (Africa/Nairobi)');
};

// Function to manually trigger daily summary (useful for testing)
export const triggerDailySummary = async (date?: string): Promise<void> => {
  try {
    console.log('🔄 Manually triggering daily summary...');
    
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const dailySummary = await summaryService.generateDailySummary(targetDate);
    const aiSummary = await summaryService.generateAISummary(dailySummary);
    
    await summaryService.saveDailySummary(dailySummary, aiSummary);
    await notificationService.sendDailySummary(aiSummary);
    
    console.log(`✅ Manual daily summary completed for ${targetDate}`);
    
  } catch (error) {
    console.error('❌ Error in manual daily summary:', error);
    throw error;
  }
};

// Weekly summary scheduler (optional - runs every Sunday at 9 AM)
export const startWeeklySummaryScheduler = (): void => {
  cron.schedule('0 9 * * 0', async () => {
    try {
      console.log('📅 Weekly summary scheduler triggered');
      
      const today = new Date();
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const startDate = oneWeekAgo.toISOString().split('T')[0]!;
      const endDate = today.toISOString().split('T')[0]!;
      
      const weeklySummaries = await summaryService.getDailySummariesByDateRange(startDate, endDate);
      
      let weeklyReport = `📊 WEEKLY CLEANKILI REPORT\n`;
      weeklyReport += `Period: ${startDate} to ${endDate}\n\n`;
      
      const totalReports = weeklySummaries.reduce((sum, day) => sum + day.total_reports, 0);
      const totalResolved = weeklySummaries.reduce((sum, day) => sum + day.resolved_reports, 0);
      const completionRate = totalReports > 0 ? Math.round((totalResolved / totalReports) * 100) : 0;
      
      weeklyReport += `📈 WEEK OVERVIEW:\n`;
      weeklyReport += `Total Reports: ${totalReports}\n`;
      weeklyReport += `Resolved: ${totalResolved}\n`;
      weeklyReport += `Completion Rate: ${completionRate}%\n\n`;
      
      weeklyReport += `📊 Daily Breakdown:\n`;
      weeklySummaries.forEach(day => {
        weeklyReport += `${day.date}: ${day.total_reports} reports (${day.resolved_reports} resolved)\n`;
      });
      
      await notificationService.sendDailySummary(weeklyReport);
      
      console.log('✅ Weekly summary sent successfully');
      
    } catch (error) {
      console.error('❌ Error in weekly summary scheduler:', error);
    }
  }, {
    scheduled: true,
    timezone: "Africa/Nairobi"
  });

  console.log('✅ Weekly summary scheduler started - will run every Sunday at 9 AM');
};
