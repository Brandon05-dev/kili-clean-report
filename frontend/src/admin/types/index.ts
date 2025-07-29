// Admin Types for CleanKili

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  role: 'admin' | 'super_admin';
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  admin?: AdminUser;
  error?: string;
  message?: string;
}

export interface AdminStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  totalAdmins: number;
  activeAdmins: number;
}

export interface InviteAdminData {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
}

export interface AdminInvitation {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}

export interface ReportData {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  imageUrl?: string;
  reporterId: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  stats: AdminStats;
  recentReports: ReportData[];
  adminActivities: AdminActivity[];
}

export interface AdminActivity {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface VerificationData {
  token: string;
  email?: string;
  phoneNumber?: string;
  code?: string;
}

export interface AdminPermissions {
  canViewReports: boolean;
  canEditReports: boolean;
  canDeleteReports: boolean;
  canManageAdmins: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canSendNotifications: boolean;
}

export type AdminRole = 'admin' | 'super_admin';
export type ReportStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';
export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}
