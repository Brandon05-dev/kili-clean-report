import twilio from 'twilio';

export interface AlertMessage {
  to: string;
  body: string;
  mediaUrl?: string;
}

export interface DeliveryStatus {
  messageId: string;
  channel: 'whatsapp' | 'sms';
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  timestamp: Date;
  error?: string;
}

export interface AlertResult {
  whatsapp: DeliveryStatus[];
  sms: DeliveryStatus[];
  totalSent: number;
  totalFailed: number;
}

export class MultiChannelAlertService {
  private client: twilio.Twilio;
  private whatsappNumber: string;
  private smsNumber: string;
  private adminNumbers: string[];
  private enableWhatsApp: boolean;
  private enableSMS: boolean;

  constructor() {
    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
    this.smsNumber = process.env.TWILIO_SMS_NUMBER || '+14155238886';
    
    // Parse admin phone numbers
    this.adminNumbers = (process.env.ADMIN_PHONE_NUMBERS || '').split(',').map(num => num.trim());
    
    // Feature toggles
    this.enableWhatsApp = process.env.ENABLE_WHATSAPP_ALERTS !== 'false';
    this.enableSMS = process.env.ENABLE_SMS_ALERTS !== 'false';

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not found in environment variables');
    }

    this.client = twilio(accountSid, authToken);
  }

  /**
   * 📱🔔 Send multi-channel alert (WhatsApp + SMS fallback)
   */
  async sendMultiChannelAlert(report: any): Promise<AlertResult> {
    const result: AlertResult = {
      whatsapp: [],
      sms: [],
      totalSent: 0,
      totalFailed: 0
    };

    console.log(`🚨 Sending multi-channel alert for report: ${report.id}`);

    // Generate short links
    const shortLinks = await this.generateShortLinks(report);
    
    // Send to each admin
    for (const adminNumber of this.adminNumbers) {
      // Try WhatsApp first
      if (this.enableWhatsApp) {
        const whatsappResult = await this.sendWhatsAppAlert(adminNumber, report, shortLinks);
        result.whatsapp.push(whatsappResult);
        
        if (whatsappResult.status === 'sent') {
          result.totalSent++;
          continue; // Skip SMS if WhatsApp succeeded
        }
      }

      // Fallback to SMS if WhatsApp failed or disabled
      if (this.enableSMS) {
        const smsResult = await this.sendSMSAlert(adminNumber, report, shortLinks);
        result.sms.push(smsResult);
        
        if (smsResult.status === 'sent') {
          result.totalSent++;
        } else {
          result.totalFailed++;
        }
      }
    }

    console.log(`📊 Alert summary: ${result.totalSent} sent, ${result.totalFailed} failed`);
    return result;
  }

  /**
   * 📱 Send WhatsApp alert
   */
  private async sendWhatsAppAlert(adminNumber: string, report: any, shortLinks: any): Promise<DeliveryStatus> {
    try {
      const whatsappNumber = adminNumber.startsWith('whatsapp:') ? adminNumber : `whatsapp:${adminNumber}`;
      const message = this.formatWhatsAppAlert(report, shortLinks);
      
      const messageData: any = {
        from: this.whatsappNumber,
        to: whatsappNumber,
        body: message
      };

      // Add photo if available and short link exists
      if (report.photoUrl && shortLinks.photo) {
        messageData.mediaUrl = [shortLinks.photo];
      }

      const twilioMessage = await this.client.messages.create(messageData);
      
      console.log(`✅ WhatsApp sent to ${adminNumber} - ID: ${twilioMessage.sid}`);
      
      return {
        messageId: twilioMessage.sid,
        channel: 'whatsapp',
        status: 'sent',
        timestamp: new Date()
      };
      
    } catch (error: any) {
      console.error(`❌ WhatsApp failed for ${adminNumber}:`, error.message);
      return {
        messageId: '',
        channel: 'whatsapp',
        status: 'failed',
        timestamp: new Date(),
        error: error.message
      };
    }
  }

  /**
   * 📲 Send SMS alert (fallback)
   */
  private async sendSMSAlert(adminNumber: string, report: any, shortLinks: any): Promise<DeliveryStatus> {
    try {
      const smsNumber = adminNumber.startsWith('+') ? adminNumber : `+${adminNumber}`;
      const message = this.formatSMSAlert(report, shortLinks);
      
      const twilioMessage = await this.client.messages.create({
        from: this.smsNumber,
        to: smsNumber,
        body: message
      });
      
      console.log(`✅ SMS sent to ${adminNumber} - ID: ${twilioMessage.sid}`);
      
      return {
        messageId: twilioMessage.sid,
        channel: 'sms',
        status: 'sent',
        timestamp: new Date()
      };
      
    } catch (error: any) {
      console.error(`❌ SMS failed for ${adminNumber}:`, error.message);
      return {
        messageId: '',
        channel: 'sms',
        status: 'failed',
        timestamp: new Date(),
        error: error.message
      };
    }
  }

  /**
   * 📊 Send daily summary via both channels
   */
  async sendDailySummary(summaryData: any): Promise<AlertResult> {
    const result: AlertResult = {
      whatsapp: [],
      sms: [],
      totalSent: 0,
      totalFailed: 0
    };

    console.log(`📊 Sending daily summary via multi-channel`);

    // Send to each admin
    for (const adminNumber of this.adminNumbers) {
      // Try WhatsApp first
      if (this.enableWhatsApp) {
        const whatsappResult = await this.sendWhatsAppSummary(adminNumber, summaryData);
        result.whatsapp.push(whatsappResult);
        
        if (whatsappResult.status === 'sent') {
          result.totalSent++;
        }
      }

      // Also send SMS version (shorter format)
      if (this.enableSMS) {
        const smsResult = await this.sendSMSSummary(adminNumber, summaryData);
        result.sms.push(smsResult);
        
        if (smsResult.status === 'sent') {
          result.totalSent++;
        } else {
          result.totalFailed++;
        }
      }
    }

    return result;
  }

  /**
   * 📱 Send WhatsApp daily summary
   */
  private async sendWhatsAppSummary(adminNumber: string, summaryData: any): Promise<DeliveryStatus> {
    try {
      const whatsappNumber = adminNumber.startsWith('whatsapp:') ? adminNumber : `whatsapp:${adminNumber}`;
      const message = this.formatWhatsAppSummary(summaryData);
      
      const twilioMessage = await this.client.messages.create({
        from: this.whatsappNumber,
        to: whatsappNumber,
        body: message
      });
      
      return {
        messageId: twilioMessage.sid,
        channel: 'whatsapp',
        status: 'sent',
        timestamp: new Date()
      };
      
    } catch (error: any) {
      console.error(`❌ WhatsApp summary failed for ${adminNumber}:`, error.message);
      return {
        messageId: '',
        channel: 'whatsapp',
        status: 'failed',
        timestamp: new Date(),
        error: error.message
      };
    }
  }

  /**
   * 📲 Send SMS daily summary (shorter format)
   */
  private async sendSMSSummary(adminNumber: string, summaryData: any): Promise<DeliveryStatus> {
    try {
      const smsNumber = adminNumber.startsWith('+') ? adminNumber : `+${adminNumber}`;
      const message = this.formatSMSSummary(summaryData);
      
      const twilioMessage = await this.client.messages.create({
        from: this.smsNumber,
        to: smsNumber,
        body: message
      });
      
      return {
        messageId: twilioMessage.sid,
        channel: 'sms',
        status: 'sent',
        timestamp: new Date()
      };
      
    } catch (error: any) {
      console.error(`❌ SMS summary failed for ${adminNumber}:`, error.message);
      return {
        messageId: '',
        channel: 'sms',
        status: 'failed',
        timestamp: new Date(),
        error: error.message
      };
    }
  }

  /**
   * 🔗 Generate short links for photos and maps
   */
  private async generateShortLinks(report: any): Promise<{ photo?: string; map?: string; report?: string }> {
    const links: any = {};
    
    try {
      // Generate map link if coordinates available
      if (report.coordinates) {
        const mapUrl = `https://maps.google.com/?q=${report.coordinates.lat},${report.coordinates.lng}`;
        links.map = await this.shortenUrl(mapUrl);
      }
      
      // Generate photo link if available
      if (report.photoUrl) {
        links.photo = await this.shortenUrl(report.photoUrl);
      }
      
      // Generate report detail link
      if (report.id) {
        const reportUrl = `${process.env.FRONTEND_URL || 'https://cleankili.app'}/reports/${report.id}`;
        links.report = await this.shortenUrl(reportUrl);
      }
      
    } catch (error) {
      console.error('❌ Error generating short links:', error);
      // Return original URLs as fallback
      if (report.coordinates) {
        links.map = `https://maps.google.com/?q=${report.coordinates.lat},${report.coordinates.lng}`;
      }
      if (report.photoUrl) {
        links.photo = report.photoUrl;
      }
    }
    
    return links;
  }

  /**
   * ✂️ Shorten URL using Bitly or TinyURL
   */
  private async shortenUrl(originalUrl: string): Promise<string> {
    try {
      // Use TinyURL as it doesn't require API key
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`);
      const shortUrl = await response.text();
      
      if (shortUrl.startsWith('https://tinyurl.com/')) {
        return shortUrl;
      }
      
      return originalUrl; // Fallback to original if shortening fails
      
    } catch (error) {
      console.error('❌ URL shortening failed:', error);
      return originalUrl; // Fallback to original URL
    }
  }

  /**
   * 📱 Format WhatsApp alert message
   */
  private formatWhatsAppAlert(report: any, shortLinks: any): string {
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
    
    if (shortLinks.map) {
      message += `🗺️ *Map:* ${shortLinks.map}\n`;
    }
    
    if (shortLinks.photo) {
      message += `📸 *Photo:* ${shortLinks.photo}\n`;
    }
    
    if (shortLinks.report) {
      message += `📋 *Details:* ${shortLinks.report}\n`;
    }
    
    message += `\n#CleanKili #Alert`;

    return message;
  }

  /**
   * 📲 Format SMS alert message (shorter)
   */
  private formatSMSAlert(report: any, shortLinks: any): string {
    const time = new Date().toLocaleTimeString('en-KE', { 
      timeZone: 'Africa/Nairobi',
      timeStyle: 'short'
    });

    let message = `CleanKili Alert (${time})\n\n`;
    message += `Location: ${report.location || 'N/A'}\n`;
    message += `Issue: ${(report.description || '').substring(0, 100)}${report.description?.length > 100 ? '...' : ''}\n`;
    message += `Status: ${report.status || 'Pending'}\n`;
    
    if (shortLinks.map) {
      message += `Map: ${shortLinks.map}\n`;
    }
    
    if (shortLinks.report) {
      message += `Details: ${shortLinks.report}`;
    }

    return message;
  }

  /**
   * 📱 Format WhatsApp daily summary
   */
  private formatWhatsAppSummary(summaryData: any): string {
    const today = new Date().toLocaleDateString('en-KE', { 
      timeZone: 'Africa/Nairobi',
      dateStyle: 'full'
    });

    let message = `📊 *CleanKili Daily Summary*\n`;
    message += `📅 ${today}\n\n`;
    
    message += `📈 *Overview:*\n`;
    message += `• Total: ${summaryData.totalReports}\n`;
    message += `• New: ${summaryData.newReports}\n`;
    message += `• Pending: ${summaryData.pendingReports}\n`;
    message += `• Resolved: ${summaryData.resolvedReports}\n\n`;
    
    if (summaryData.topIssues?.length > 0) {
      message += `🔥 *Top Issues:*\n`;
      summaryData.topIssues.slice(0, 3).forEach((issue: any, index: number) => {
        message += `${index + 1}. ${issue.type} (${issue.count})\n`;
      });
      message += '\n';
    }
    
    if (summaryData.topLocations?.length > 0) {
      message += `📍 *Hotspots:*\n`;
      summaryData.topLocations.slice(0, 3).forEach((location: any, index: number) => {
        message += `${index + 1}. ${location.name} (${location.count})\n`;
      });
      message += '\n';
    }
    
    if (summaryData.aiInsights) {
      message += `🤖 *AI Insights:*\n${summaryData.aiInsights}\n\n`;
    }
    
    message += `#CleanKili #DailySummary`;
    return message;
  }

  /**
   * 📲 Format SMS daily summary (shorter)
   */
  private formatSMSSummary(summaryData: any): string {
    const today = new Date().toLocaleDateString('en-KE', { 
      timeZone: 'Africa/Nairobi',
      dateStyle: 'short'
    });

    let message = `CleanKili Summary (${today})\n\n`;
    message += `Reports: ${summaryData.totalReports} total, ${summaryData.pendingReports} pending, ${summaryData.resolvedReports} resolved\n\n`;
    
    if (summaryData.topIssues?.length > 0) {
      message += `Top Issues: ${summaryData.topIssues.slice(0, 2).map((i: any) => `${i.type}(${i.count})`).join(', ')}\n`;
    }
    
    if (summaryData.topLocations?.length > 0) {
      message += `Hotspots: ${summaryData.topLocations.slice(0, 2).map((l: any) => `${l.name}(${l.count})`).join(', ')}\n`;
    }
    
    return message;
  }

  /**
   * 🧪 Test multi-channel connectivity
   */
  async testConnectivity(): Promise<{ whatsapp: boolean; sms: boolean }> {
    const results = { whatsapp: false, sms: false };
    
    if (this.adminNumbers.length === 0) {
      console.log('⚠️ No admin numbers configured');
      return results;
    }

    const testMessage = `🧪 CleanKili Test - ${new Date().toISOString()}`;
    const firstAdmin = this.adminNumbers[0];
    
    // Test WhatsApp
    if (this.enableWhatsApp) {
      try {
        const whatsappNumber = firstAdmin.startsWith('whatsapp:') ? firstAdmin : `whatsapp:${firstAdmin}`;
        await this.client.messages.create({
          from: this.whatsappNumber,
          to: whatsappNumber,
          body: testMessage
        });
        results.whatsapp = true;
        console.log('✅ WhatsApp test successful');
      } catch (error) {
        console.error('❌ WhatsApp test failed:', error);
      }
    }
    
    // Test SMS
    if (this.enableSMS) {
      try {
        const smsNumber = firstAdmin.startsWith('+') ? firstAdmin : `+${firstAdmin}`;
        await this.client.messages.create({
          from: this.smsNumber,
          to: smsNumber,
          body: testMessage
        });
        results.sms = true;
        console.log('✅ SMS test successful');
      } catch (error) {
        console.error('❌ SMS test failed:', error);
      }
    }
    
    return results;
  }
}
