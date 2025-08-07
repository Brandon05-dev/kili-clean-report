import { AdminReport, MaintenanceTeam, AdminUser, DashboardStats, AdminState } from '@/types/admin';
import { getAllReports, updateReportStatus } from './database';
import { DatabaseReport } from '@/types/report';

// Admin dashboard service with localStorage persistence
class AdminDashboardService {
  private static readonly STORAGE_KEY = 'admin_dashboard_state';
  private static readonly ADMIN_CREDENTIALS = {
    email: 'admin@kili.com',
    password: 'password123'
  };

  // Convert DatabaseReport to AdminReport format
  private convertToAdminReport(dbReport: DatabaseReport): AdminReport {
    return {
      id: dbReport.id,
      type: this.formatReportType(dbReport.type),
      description: dbReport.description,
      location: dbReport.location.address,
      photoURL: dbReport.photoURL,
      timestamp: dbReport.timestamp,
      status: dbReport.status === 'Resolved' ? 'Completed' : 'Active',
      assignedTeam: dbReport.assignedTo,
      submittedBy: 'Community Member', // Default since we don't have this field in DatabaseReport
      completedAt: dbReport.status === 'Resolved' ? dbReport.updatedAt : undefined,
    };
  }

  // Format report type from database format to display format
  private formatReportType(type: string): string {
    const typeMap: Record<string, string> = {
      'illegal-dumping': 'Illegal Dumping',
      'blocked-drain': 'Blocked Drainage',
      'overflowing-bin': 'Overflowing Bin',
      'littering': 'Littering',
      'air-pollution': 'Air Pollution',
      'water-pollution': 'Water Pollution',
      'noise-pollution': 'Noise Pollution',
      'other': 'Other Environmental Issue'
    };
    return typeMap[type] || type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Get current state from localStorage
  private getState(): AdminState {
    const stored = localStorage.getItem(AdminDashboardService.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return this.getInitialState();
  }

  // Save state to localStorage
  private saveState(state: AdminState): void {
    localStorage.setItem(AdminDashboardService.STORAGE_KEY, JSON.stringify(state));
  }

  // Initial state with dummy data
  private getInitialState(): AdminState {
    const now = new Date().toISOString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    return {
      user: null,
      reports: [
        {
          id: 'report_001',
          type: 'Illegal Dumping',
          description: 'Large pile of construction waste dumped near residential area. Attracting pests and creating health hazard.',
          location: 'Kilimani, Near Yaya Centre',
          photoURL: '/placeholder.svg',
          timestamp: now,
          status: 'Active',
          submittedBy: 'John Mwangi',
        },
        {
          id: 'report_002',
          type: 'Blocked Drainage',
          description: 'Storm drain completely blocked with plastic waste and debris. Water accumulating during rains.',
          location: 'Kilimani, Wood Avenue',
          photoURL: '/placeholder.svg',
          timestamp: yesterday,
          status: 'Active',
          assignedTeam: 'Drainage Team',
          submittedBy: 'Mary Wanjiku',
        },
        {
          id: 'report_003',
          type: 'Littering',
          description: 'Scattered plastic bottles and food containers along busy roadside.',
          location: 'Kilimani, Argwings Kodhek Road',
          photoURL: '/placeholder.svg',
          timestamp: twoDaysAgo,
          status: 'Completed',
          assignedTeam: 'Sanitation Team',
          submittedBy: 'Peter Ochieng',
          completedAt: yesterday,
        },
        {
          id: 'report_004',
          type: 'Air Pollution',
          description: 'Strong chemical smell and visible smoke from nearby construction site affecting residents.',
          location: 'Kilimani, Hurlingham',
          photoURL: '/placeholder.svg',
          timestamp: now,
          status: 'Active',
          submittedBy: 'Sarah Njeri',
        },
        {
          id: 'report_005',
          type: 'Water Pollution',
          description: 'Oil spill contaminating local water source. Urgent environmental cleanup required.',
          location: 'Kilimani, Ring Road',
          photoURL: '/placeholder.svg',
          timestamp: twoDaysAgo,
          status: 'Completed',
          assignedTeam: 'Environmental Team',
          submittedBy: 'David Kiprotich',
          completedAt: now,
        },
      ],
      teams: [
        {
          id: 'team_001',
          name: 'Roads Crew',
          specialty: 'Road maintenance and debris removal',
          isActive: true,
        },
        {
          id: 'team_002',
          name: 'Sanitation Team',
          specialty: 'Waste collection and cleaning',
          isActive: true,
        },
        {
          id: 'team_003',
          name: 'Drainage Team',
          specialty: 'Storm drains and water systems',
          isActive: true,
        },
        {
          id: 'team_004',
          name: 'Environmental Team',
          specialty: 'Pollution cleanup and environmental restoration',
          isActive: true,
        },
      ],
      stats: {
        newReports: 0,
        totalActiveReports: 0,
        availableTeams: 0,
        completedToday: 0,
      }
    };
  }

  // Calculate stats from current data
  private calculateStats(reports: AdminReport[], teams: MaintenanceTeam[]): DashboardStats {
    const activeReports = reports.filter(r => r.status === 'Active');
    const today = new Date().toDateString();
    
    return {
      newReports: activeReports.filter(r => !r.assignedTeam).length,
      totalActiveReports: activeReports.length,
      availableTeams: teams.filter(t => t.isActive).length,
      completedToday: reports.filter(r => 
        r.status === 'Completed' && 
        r.completedAt && 
        new Date(r.completedAt).toDateString() === today
      ).length,
    };
  }

  // Login method
  login(email: string, password: string): boolean {
    if (email === AdminDashboardService.ADMIN_CREDENTIALS.email && 
        password === AdminDashboardService.ADMIN_CREDENTIALS.password) {
      
      const state = this.getState();
      state.user = {
        email,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
      };
      state.stats = this.calculateStats(state.reports, state.teams);
      this.saveState(state);
      return true;
    }
    return false;
  }

  // Logout method
  logout(): void {
    const state = this.getState();
    state.user = null;
    this.saveState(state);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const state = this.getState();
    return state.user?.isAuthenticated || false;
  }

  // Get current user
  getCurrentUser(): AdminUser | null {
    const state = this.getState();
    return state.user;
  }

  // Get all reports from the main database and convert them
  async getAllReports(): Promise<AdminReport[]> {
    try {
      const dbReports = await getAllReports();
      return dbReports.map(report => this.convertToAdminReport(report));
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Fallback to stored state if database fails
      const state = this.getState();
      return state.reports;
    }
  }

  // Get active reports from main database
  async getActiveReports(): Promise<AdminReport[]> {
    const allReports = await this.getAllReports();
    return allReports.filter(r => r.status === 'Active');
  }

  // Get completed reports from main database
  async getCompletedReports(): Promise<AdminReport[]> {
    const allReports = await this.getAllReports();
    return allReports.filter(r => r.status === 'Completed');
  }

  // Get teams
  getTeams(): MaintenanceTeam[] {
    const state = this.getState();
    return state.teams;
  }

  // Get dashboard stats with real data
  async getStats(): Promise<DashboardStats> {
    try {
      const allReports = await this.getAllReports();
      return this.calculateStats(allReports, this.getTeams());
    } catch (error) {
      console.error('Error calculating stats:', error);
      const state = this.getState();
      return this.calculateStats(state.reports, state.teams);
    }
  }

  // Assign team to report with database integration
  async assignTeam(reportId: string, teamId: string): Promise<boolean> {
    const state = this.getState();
    const team = state.teams.find(t => t.id === teamId);
    
    if (!team) return false;

    try {
      // Try to update in main database first
      await updateReportStatus(reportId, 'In Progress', team.name, `Assigned to: ${team.name}`);
    } catch (error) {
      console.error('Error updating assignment in main database:', error);
    }

    // Update in localStorage as well
    const reportIndex = state.reports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
      state.reports[reportIndex].assignedTeam = team.name;
      state.reports[reportIndex].status = 'Active';
      state.stats = this.calculateStats(state.reports, state.teams);
      this.saveState(state);
      return true;
    }
    return false;
  }

  // Mark report as completed with database integration
  async markReportCompleted(reportId: string): Promise<boolean> {
    const state = this.getState();
    const reportIndex = state.reports.findIndex(r => r.id === reportId);
    
    if (reportIndex === -1 || state.reports[reportIndex].status !== 'Active') {
      return false;
    }

    try {
      // Update in main database first
      await updateReportStatus(reportId, 'Resolved', state.reports[reportIndex].assignedTeam, 'Completed by maintenance team');
    } catch (error) {
      console.error('Error updating completion in main database:', error);
    }

    // Update in localStorage
    state.reports[reportIndex].status = 'Completed';
    state.reports[reportIndex].completedAt = new Date().toISOString();
    state.stats = this.calculateStats(state.reports, state.teams);
    this.saveState(state);
    return true;
  }

  // Add new team
  addTeam(name: string, specialty: string): boolean {
    const state = this.getState();
    
    // Check if team name already exists
    if (state.teams.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      return false;
    }
    
    const newTeam: MaintenanceTeam = {
      id: `team_${Date.now()}`,
      name,
      specialty,
      isActive: true,
    };
    
    state.teams.push(newTeam);
    state.stats = this.calculateStats(state.reports, state.teams);
    this.saveState(state);
    return true;
  }

  // Delete team
  deleteTeam(teamId: string): boolean {
    const state = this.getState();
    const teamIndex = state.teams.findIndex(t => t.id === teamId);
    
    if (teamIndex !== -1) {
      const teamName = state.teams[teamIndex].name;
      
      // Remove team assignments from reports
      state.reports.forEach(report => {
        if (report.assignedTeam === teamName) {
          report.assignedTeam = undefined;
        }
      });
      
      // Remove team
      state.teams.splice(teamIndex, 1);
      state.stats = this.calculateStats(state.reports, state.teams);
      this.saveState(state);
      return true;
    }
    return false;
  }

  // Get report by ID
  getReportById(reportId: string): AdminReport | null {
    const state = this.getState();
    return state.reports.find(r => r.id === reportId) || null;
  }
}

export const adminDashboardService = new AdminDashboardService();
