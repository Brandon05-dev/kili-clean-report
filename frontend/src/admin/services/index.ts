// Admin Services for CleanKili Admin Panel
import { API_CONFIG, buildApiUrl } from '@/config/api';
import { 
  AdminUser, 
  AuthResponse, 
  LoginFormData, 
  RegisterFormData, 
  AdminStats,
  InviteAdminData,
  AdminInvitation,
  DashboardData,
  VerificationData 
} from '@/admin/types';

class AdminService {
  protected getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl('/api/admin/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
      }
      
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  }

  async register(userData: RegisterFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl('/api/admin/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(buildApiUrl('/api/admin/logout'), {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
    }
  }

  async verifyEmail(verificationData: VerificationData): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl(`/api/admin/verify-email?token=${verificationData.token}`), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Email verification failed.',
      };
    }
  }

  async verifyPhone(verificationData: VerificationData): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl('/api/admin/verify-phone'), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          phoneNumber: verificationData.phoneNumber,
          code: verificationData.code,
        }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Phone verification failed.',
      };
    }
  }

  async resendEmailVerification(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl('/api/admin/resend-email'), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to resend email verification.',
      };
    }
  }

  async resendSMSVerification(phoneNumber: string): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl('/api/admin/resend-sms'), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ phoneNumber }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to resend SMS verification.',
      };
    }
  }

  async getCurrentUser(): Promise<AdminUser | null> {
    try {
      const response = await fetch(buildApiUrl('/api/admin/me'), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return data.admin;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getDashboardData(): Promise<DashboardData | null> {
    try {
      const response = await fetch(buildApiUrl('/api/admin/dashboard'), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getStats(): Promise<AdminStats | null> {
    try {
      const response = await fetch(buildApiUrl('/api/admin/stats'), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }
}

// Super Admin Service (extends AdminService)
class SuperAdminService extends AdminService {
  async loginSuperAdmin(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl('/api/super-admin/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem('superAdminToken', data.token);
      }
      
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  }

  async logoutSuperAdmin(): Promise<void> {
    try {
      await fetch(buildApiUrl('/api/super-admin/logout'), {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          Authorization: `Bearer ${localStorage.getItem('superAdminToken')}`,
        },
      });
    } catch (error) {
      console.error('Super admin logout error:', error);
    } finally {
      localStorage.removeItem('superAdminToken');
    }
  }

  async getSuperAdminStats(): Promise<AdminStats | null> {
    try {
      const response = await fetch(buildApiUrl('/api/super-admin/stats'), {
        method: 'GET',
        headers: {
          ...this.getAuthHeaders(),
          Authorization: `Bearer ${localStorage.getItem('superAdminToken')}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getAllAdmins(): Promise<AdminUser[]> {
    try {
      const response = await fetch(buildApiUrl('/api/super-admin/admins'), {
        method: 'GET',
        headers: {
          ...this.getAuthHeaders(),
          Authorization: `Bearer ${localStorage.getItem('superAdminToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.admins || [];
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  async inviteAdmin(inviteData: InviteAdminData): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl('/api/super-admin/invite'), {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          Authorization: `Bearer ${localStorage.getItem('superAdminToken')}`,
        },
        body: JSON.stringify(inviteData),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send invitation.',
      };
    }
  }

  async updateAdminStatus(email: string, status: string): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl(`/api/super-admin/admins/${email}/status`), {
        method: 'PUT',
        headers: {
          ...this.getAuthHeaders(),
          Authorization: `Bearer ${localStorage.getItem('superAdminToken')}`,
        },
        body: JSON.stringify({ status }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update admin status.',
      };
    }
  }

  async deleteAdmin(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(buildApiUrl(`/api/super-admin/admins/${email}`), {
        method: 'DELETE',
        headers: {
          ...this.getAuthHeaders(),
          Authorization: `Bearer ${localStorage.getItem('superAdminToken')}`,
        },
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete admin.',
      };
    }
  }

  isSuperAdminAuthenticated(): boolean {
    return !!localStorage.getItem('superAdminToken');
  }
}

// Export service instances
export const adminService = new AdminService();
export const superAdminService = new SuperAdminService();

// Export default
export default adminService;
