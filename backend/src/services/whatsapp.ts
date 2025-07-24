import twilio from 'twilio';

export interface WhatsAppMessage {
  to: string;
  body: string;
  mediaUrl?: string;
}

export interface WhatsAppDeliveryStatus {
  messageId: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  timestamp: Date;
  error?: string;
}

export class WhatsAppService {
  private client: twilio.Twilio;
  private fromNumber: string;
  private adminNumbers: string[];

  constructor() {
    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
    
    // Parse admin phone numbers from environment
    this.adminNumbers = (process.env.ADMIN_PHONE_NUMBERS || '').split(',').map(num => num.trim());

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not found in environment variables');
    }

    this.client = twilio(accountSid, authToken);
  }

  /**
   * 📱 Send immediate WhatsApp alert for new report
   */
  async sendReportAlert(report: any): Promise<WhatsAppDeliveryStatus[]> {
    const results: WhatsAppDeliveryStatus[] = [];
    
    // Format the alert message
    const message = this.formatReportAlert(report);
    
    // Send to all admin numbers
    for (const adminNumber of this.adminNumbers) {
      try {
        const whatsappNumber = adminNumber.startsWith('whatsapp:') ? adminNumber : `whatsapp:${adminNumber}`;
        
        const messageData: any = {
          from: this.fromNumber,
          to: whatsappNumber,
          body: message
        };

        // Add photo if available
        if (report.photoUrl) {
          messageData.mediaUrl = [report.photoUrl];
        }

        const twilioMessage = await this.client.messages.create(messageData);
        
        results.push({
          messageId: twilioMessage.sid,
          status: 'sent',
          timestamp: new Date()
        });

        console.log(`✅ WhatsApp alert sent to ${adminNumber} - Message ID: ${twilioMessage.sid}`);
        
      } catch (error) {
        console.error(`❌ Failed to send WhatsApp to ${adminNumber}:`, error);
        results.push({
          messageId: '',
          status: 'failed',
          timestamp: new Date(),
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * 📊 Send daily summary WhatsApp message
   */
  async sendDailySummary(summaryData: any): Promise<WhatsAppDeliveryStatus[]> {
    const results: WhatsAppDeliveryStatus[] = [];
    
    // Format the summary message
    const message = this.formatDailySummary(summaryData);
    
    // Send to all admin numbers
    for (const adminNumber of this.adminNumbers) {
      try {
        const whatsappNumber = adminNumber.startsWith('whatsapp:') ? adminNumber : `whatsapp:${adminNumber}`;
        
        const twilioMessage = await this.client.messages.create({
          from: this.fromNumber,
          to: whatsappNumber,
          body: message
        });
        
        results.push({
          messageId: twilioMessage.sid,
          status: 'sent',
          timestamp: new Date()
        });

        console.log(`✅ Daily summary sent to ${adminNumber} - Message ID: ${twilioMessage.sid}`);
        
      } catch (error) {
        console.error(`❌ Failed to send daily summary to ${adminNumber}:`, error);
        results.push({
          messageId: '',
          status: 'failed',
          timestamp: new Date(),
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * 🚨 Format immediate report alert message
   */
  private formatReportAlert(report: any): string {
    const timestamp = new Date().toLocaleString('en-KE', { 
      timeZone: 'Africa/Nairobi',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    let message = `🚨 *CleanKili Alert* - New Report\n\n`;
    message += `📅 *Time:* ${timestamp}\n`;
    message += `📍 *Location:* ${report.location || 'Not specified'}\n`;
    message += `📝 *Description:* ${report.description || 'No description'}\n`;
    message += `🔄 *Status:* ${report.status || 'Pending'}\n`;
    
    // Add GPS coordinates if available
    if (report.coordinates) {
      const { lat, lng } = report.coordinates;
      message += `🌍 *GPS:* ${lat}, ${lng}\n`;
      message += `🗺️ *Maps:* https://maps.google.com/?q=${lat},${lng}\n`;
    }
    
    // Add photo info
    if (report.photoUrl) {
      message += `📸 *Photo:* Available (attached)\n`;
    }
    
    message += `\n#CleanKili #EnvironmentalReport #TakeAction`;

    return message;
  }

  /**
   * 📊 Format daily summary message
   */
  private formatDailySummary(summaryData: any): string {
    const today = new Date().toLocaleDateString('en-KE', { 
      timeZone: 'Africa/Nairobi',
      dateStyle: 'full'
    });

    let message = `📊 *CleanKili Daily Summary*\n`;
    message += `📅 ${today}\n\n`;
    
    // Overall stats
    message += `📈 *Today's Overview:*\n`;
    message += `• Total Reports: ${summaryData.totalReports}\n`;
    message += `• New: ${summaryData.newReports}\n`;
    message += `• Pending: ${summaryData.pendingReports}\n`;
    message += `• Resolved: ${summaryData.resolvedReports}\n\n`;
    
    // Top issues
    if (summaryData.topIssues && summaryData.topIssues.length > 0) {
      message += `🔥 *Common Issues:*\n`;
      summaryData.topIssues.forEach((issue: any, index: number) => {
        message += `${index + 1}. ${issue.type} (${issue.count})\n`;
      });
      message += '\n';
    }
    
    // Top locations
    if (summaryData.topLocations && summaryData.topLocations.length > 0) {
      message += `📍 *Hotspot Areas:*\n`;
      summaryData.topLocations.forEach((location: any, index: number) => {
        message += `${index + 1}. ${location.name} (${location.count})\n`;
      });
      message += '\n';
    }
    
    // AI insights
    if (summaryData.aiInsights) {
      message += `🤖 *AI Insights:*\n${summaryData.aiInsights}\n\n`;
    }
    
    // Recent critical reports
    if (summaryData.criticalReports && summaryData.criticalReports.length > 0) {
      message += `🚨 *Urgent Reports:*\n`;
      summaryData.criticalReports.forEach((report: any, index: number) => {
        message += `${index + 1}. ${report.location} - ${report.description.substring(0, 50)}...\n`;
        if (report.coordinates) {
          message += `   📍 https://maps.google.com/?q=${report.coordinates.lat},${report.coordinates.lng}\n`;
        }
      });
      message += '\n';
    }
    
    message += `#CleanKili #DailySummary #EnvironmentalMonitoring`;

    return message;
  }

  /**
   * 🔍 Check message delivery status
   */
  async checkDeliveryStatus(messageId: string): Promise<WhatsAppDeliveryStatus> {
    try {
      const message = await this.client.messages(messageId).fetch();
      return {
        messageId,
        status: message.status as any,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        messageId,
        status: 'failed',
        timestamp: new Date(),
        error: error.message
      };
    }
  }

  /**
   * 📱 Test WhatsApp connection
   */
  async testConnection(): Promise<boolean> {
    try {
      if (this.adminNumbers.length === 0) {
        console.log('⚠️ No admin numbers configured');
        return false;
      }

      const testMessage = `🧪 *CleanKili Test Message*\n\nWhatsApp integration is working correctly!\n\nTimestamp: ${new Date().toISOString()}`;
      
      const firstAdmin = this.adminNumbers[0];
      const whatsappNumber = firstAdmin.startsWith('whatsapp:') ? firstAdmin : `whatsapp:${firstAdmin}`;
      
      await this.client.messages.create({
        from: this.fromNumber,
        to: whatsappNumber,
        body: testMessage
      });

      console.log('✅ Test WhatsApp message sent successfully');
      return true;
    } catch (error) {
      console.error('❌ WhatsApp test failed:', error);
      return false;
    }
  }
}
