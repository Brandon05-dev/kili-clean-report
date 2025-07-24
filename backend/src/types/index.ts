export interface Report {
  id: string;
  description: string;
  photoUrl?: string;
  lat: number;
  lng: number;
  status: ReportStatus;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  adminNotes?: string;
  priority?: Priority;
  category?: ReportCategory;
  address?: string;
  reporterEmail?: string;
  reporterPhone?: string;
}

export type ReportStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export type ReportCategory = 
  | 'Waste Management'
  | 'Water Pollution'
  | 'Air Pollution'
  | 'Noise Pollution'
  | 'Illegal Dumping'
  | 'Sewage Issues'
  | 'Road Damage'
  | 'Other';

export interface CreateReportRequest {
  description: string;
  photoUrl?: string;
  lat: number;
  lng: number;
  category?: ReportCategory;
  reporterEmail?: string;
  reporterPhone?: string;
  address?: string;
}

export interface UpdateReportRequest {
  description?: string;
  status?: ReportStatus;
  assignedTo?: string;
  adminNotes?: string;
  priority?: Priority;
  category?: ReportCategory;
}

export interface DailySummary {
  date: string;
  totalReports: number;
  pendingReports: number;
  inProgressReports: number;
  resolvedReports: number;
  rejectedReports: number;
  topLocations: LocationSummary[];
  topCategories: CategorySummary[];
  criticalReports: Report[];
}

export interface LocationSummary {
  area: string;
  count: number;
  lat: number;
  lng: number;
}

export interface CategorySummary {
  category: ReportCategory;
  count: number;
}

export interface Admin {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  invitedBy?: string;
}

export type AdminRole = 'Super Admin' | 'Admin' | 'Moderator';

export interface CreateAdminRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
}

export interface CreateSuperAdminRequest {
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateSuperAdminRequest {
  status: 'INVITED' | 'ACTIVE' | 'DEACTIVATED';
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminInvitation {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  invitedBy: string;
  invitationToken: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

export interface CompleteInvitationRequest {
  token: string;
  password: string;
  verificationCode: string;
}

export interface NotificationPayload {
  title: string;
  message: string;
  type: 'new_report' | 'daily_summary' | 'status_update';
  reportId?: string;
  priority?: Priority;
}
