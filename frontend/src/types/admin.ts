// Admin Dashboard Types
export interface AdminReport {
  id: string;
  type: string;
  description: string;
  location: string;
  photoURL?: string;
  timestamp: string;
  status: 'Active' | 'Completed';
  assignedTeam?: string;
  submittedBy: string;
  completedAt?: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  specialty: string;
  isActive: boolean;
}

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
  loginTime: string;
}

export interface DashboardStats {
  newReports: number;
  totalActiveReports: number;
  availableTeams: number;
  completedToday: number;
}

export interface AdminState {
  user: AdminUser | null;
  reports: AdminReport[];
  teams: MaintenanceTeam[];
  stats: DashboardStats;
}
