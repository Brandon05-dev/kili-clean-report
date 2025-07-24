import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../index';
import { MultiChannelAlertService } from './multiChannelAlert';

export interface Report {
  id?: string;
  location: string;
  description: string;
  photoUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  status: 'new' | 'pending' | 'in-progress' | 'resolved' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reportedBy?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  whatsappAlertSent?: boolean;
  whatsappMessageIds?: string[];
}

export class ReportService {
  private alertService: MultiChannelAlertService;
  private reportsCollection = 'reports';
  private summariesCollection = 'daily_summaries';

  constructor() {
    this.alertService = new MultiChannelAlertService();
  }

  /**
   * 📝 Create a new report and send WhatsApp alert
   */
  async createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Add timestamps
      const now = new Date();
      const report: Omit<Report, 'id'> = {
        ...reportData,
        createdAt: now,
        updatedAt: now,
        status: reportData.status || 'new',
        priority: reportData.priority || 'medium',
        whatsappAlertSent: false
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, this.reportsCollection), {
        ...report,
        createdAt: Timestamp.fromDate(report.createdAt),
        updatedAt: Timestamp.fromDate(report.updatedAt)
      });

      console.log(`✅ Report created with ID: ${docRef.id}`);

      // Send immediate multi-channel alert (WhatsApp + SMS fallback)
      try {
        const reportWithId = { ...report, id: docRef.id };
        const alertResults = await this.alertService.sendMultiChannelAlert(reportWithId);
        
        // Collect all successful message IDs from both channels
        const allSuccessfulMessages = [
          ...alertResults.whatsapp.filter((result: any) => result.status === 'sent'),
          ...alertResults.sms.filter((result: any) => result.status === 'sent')
        ];
        
        const messageIds = allSuccessfulMessages.map((result: any) => result.messageId);

        await updateDoc(doc(db, this.reportsCollection, docRef.id), {
          whatsappAlertSent: alertResults.totalSent > 0,
          alertMessageIds: messageIds,
          alertChannels: {
            whatsappSent: alertResults.whatsapp.length,
            smsSent: alertResults.sms.length,
            totalSent: alertResults.totalSent,
            totalFailed: alertResults.totalFailed
          },
          updatedAt: Timestamp.fromDate(new Date())
        });

        console.log(`📱 Multi-channel alerts sent for report ${docRef.id}: ${alertResults.totalSent} successful, ${alertResults.totalFailed} failed`);
        
      } catch (alertError) {
        console.error('❌ Failed to send multi-channel alert:', alertError);
        // Don't fail the report creation if alerts fail
      }

      return docRef.id;
      
    } catch (error) {
      console.error('❌ Error creating report:', error);
      throw error;
    }
  }

  /**
   * 📋 Get reports by date range
   */
  async getReportsByDateRange(startDate: Date, endDate: Date): Promise<Report[]> {
    try {
      const q = query(
        collection(db, this.reportsCollection),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<', Timestamp.fromDate(endDate)),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reports: Report[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reports.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          resolvedAt: data.resolvedAt ? data.resolvedAt.toDate() : undefined
        } as Report);
      });

      return reports;
      
    } catch (error) {
      console.error('❌ Error fetching reports by date range:', error);
      throw error;
    }
  }

  /**
   * 📋 Get all reports
   */
  async getAllReports(): Promise<Report[]> {
    try {
      const q = query(
        collection(db, this.reportsCollection),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reports: Report[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reports.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          resolvedAt: data.resolvedAt ? data.resolvedAt.toDate() : undefined
        } as Report);
      });

      return reports;
      
    } catch (error) {
      console.error('❌ Error fetching all reports:', error);
      throw error;
    }
  }

  /**
   * 📄 Get report by ID
   */
  async getReportById(id: string): Promise<Report | null> {
    try {
      const docRef = doc(db, this.reportsCollection, id);
      const docSnap = await getDocs(query(collection(db, this.reportsCollection), where('__name__', '==', id)));
      
      if (docSnap.empty) {
        return null;
      }

      const data = docSnap.docs[0].data();
      return {
        id: docSnap.docs[0].id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        resolvedAt: data.resolvedAt ? data.resolvedAt.toDate() : undefined
      } as Report;
      
    } catch (error) {
      console.error('❌ Error fetching report by ID:', error);
      throw error;
    }
  }

  /**
   * ✏️ Update report status
   */
  async updateReportStatus(id: string, status: Report['status'], assignedTo?: string): Promise<void> {
    try {
      const updateData: any = {
        status,
        updatedAt: Timestamp.fromDate(new Date())
      };

      if (assignedTo) {
        updateData.assignedTo = assignedTo;
      }

      if (status === 'resolved' || status === 'completed') {
        updateData.resolvedAt = Timestamp.fromDate(new Date());
      }

      await updateDoc(doc(db, this.reportsCollection, id), updateData);
      console.log(`✅ Report ${id} status updated to: ${status}`);
      
    } catch (error) {
      console.error('❌ Error updating report status:', error);
      throw error;
    }
  }

  /**
   * 🗑️ Delete report
   */
  async deleteReport(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.reportsCollection, id));
      console.log(`✅ Report ${id} deleted`);
      
    } catch (error) {
      console.error('❌ Error deleting report:', error);
      throw error;
    }
  }

  /**
   * 📊 Save daily summary to database
   */
  async saveDailySummary(summaryData: any, deliveryResults: any[]): Promise<void> {
    try {
      const summaryDoc = {
        ...summaryData,
        deliveryResults,
        createdAt: Timestamp.fromDate(new Date())
      };

      await addDoc(collection(db, this.summariesCollection), summaryDoc);
      console.log(`✅ Daily summary saved for ${summaryData.date}`);
      
    } catch (error) {
      console.error('❌ Error saving daily summary:', error);
      throw error;
    }
  }

  /**
   * 📈 Get reports statistics
   */
  async getReportsStatistics(): Promise<any> {
    try {
      const reports = await this.getAllReports();
      
      const stats = {
        total: reports.length,
        new: reports.filter(r => r.status === 'new').length,
        pending: reports.filter(r => r.status === 'pending').length,
        inProgress: reports.filter(r => r.status === 'in-progress').length,
        resolved: reports.filter(r => r.status === 'resolved' || r.status === 'completed').length,
        byPriority: {
          low: reports.filter(r => r.priority === 'low').length,
          medium: reports.filter(r => r.priority === 'medium').length,
          high: reports.filter(r => r.priority === 'high').length,
          critical: reports.filter(r => r.priority === 'critical').length
        },
        todayReports: reports.filter(r => {
          const today = new Date();
          const reportDate = new Date(r.createdAt);
          return reportDate.toDateString() === today.toDateString();
        }).length
      };

      return stats;
      
    } catch (error) {
      console.error('❌ Error getting reports statistics:', error);
      throw error;
    }
  }

  /**
   * 🔍 Search reports by location or description
   */
  async searchReports(searchTerm: string): Promise<Report[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation that gets all reports and filters
      // For production, consider using Algolia or Elasticsearch
      
      const allReports = await this.getAllReports();
      const searchLower = searchTerm.toLowerCase();
      
      const filteredReports = allReports.filter(report => 
        report.location.toLowerCase().includes(searchLower) ||
        report.description.toLowerCase().includes(searchLower)
      );

      return filteredReports;
      
    } catch (error) {
      console.error('❌ Error searching reports:', error);
      throw error;
    }
  }
}
