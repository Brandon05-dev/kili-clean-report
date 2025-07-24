// Admin Types for CleanKili Secure Admin System

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  status: 'INVITED' | 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  passwordHash?: string;
  emailVerificationToken?: string;
  phoneVerificationCode?: string;
  phoneVerificationExpiry?: Date;
  emailVerificationExpiry?: Date;
  invitedBy?: string; // Super Admin ID who invited this admin
  invitedAt: Date;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
  lastLoginAt?: Date;
  passwordSetAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminInvite {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  invitedBy: string; // Super Admin ID
  invitationToken: string;
  phoneOtp: string;
  otpExpiry: Date;
  invitationExpiry: Date;
  status: 'SENT' | 'EMAIL_VERIFIED' | 'PHONE_VERIFIED' | 'COMPLETED' | 'EXPIRED';
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminAction {
  id: string;
  adminId: string; // Who performed the action
  targetAdminId?: string; // Who was affected (for invites, suspensions, etc.)
  action: 'INVITE_SENT' | 'ADMIN_ACTIVATED' | 'ADMIN_SUSPENDED' | 'ADMIN_DEACTIVATED' | 'LOGIN' | 'PASSWORD_RESET' | 'ROLE_CHANGED';
  details: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface SuperAdminStats {
  totalAdmins: number;
  activeAdmins: number;
  pendingInvites: number;
  suspendedAdmins: number;
  recentActions: AdminAction[];
  adminsByRole: {
    ADMIN: number;
    SUPER_ADMIN: number;
  };
}

export interface InviteAdminRequest {
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

export interface CompleteInviteRequest {
  invitationToken: string;
  phoneOtp: string;
  password: string;
}

export interface AdminAuthResponse {
  success: boolean;
  admin?: AdminUser;
  token?: string;
  error?: string;
  redirectTo?: string;
}

export interface InviteResponse {
  success: boolean;
  inviteId?: string;
  message?: string;
  error?: string;
}
