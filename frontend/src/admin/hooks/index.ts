// Admin Hooks for CleanKili Admin Panel
import { useState, useEffect, useCallback } from 'react';
import { adminService, superAdminService } from '@/admin/services';
import { AdminUser, AdminStats, DashboardData, AuthResponse, InviteAdminData, ValidationRule } from '@/admin/types';

// Hook for admin authentication
export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (adminService.isAuthenticated()) {
        const userData = await adminService.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          adminService.logout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    const result = await adminService.login({ email, password });
    
    if (result.success && result.admin) {
      setUser(result.admin);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await adminService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const refreshUser = useCallback(async () => {
    if (adminService.isAuthenticated()) {
      const userData = await adminService.getCurrentUser();
      setUser(userData);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };
};

// Hook for super admin authentication
export const useSuperAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(superAdminService.isSuperAdminAuthenticated());
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    const result = await superAdminService.loginSuperAdmin({ email, password });
    
    if (result.success && result.admin) {
      setUser(result.admin);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await superAdminService.logoutSuperAdmin();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };
};

// Hook for admin dashboard data
export const useAdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dashboardData = await adminService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refresh: fetchDashboardData,
  };
};

// Hook for admin stats
export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const statsData = await adminService.getStats();
      setStats(statsData);
    } catch (err) {
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
};

// Hook for super admin stats
export const useSuperAdminStats = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const statsData = await superAdminService.getSuperAdminStats();
      setStats(statsData);
    } catch (err) {
      setError('Failed to fetch super admin statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
};

// Hook for managing admins (super admin only)
export const useAdminManagement = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const adminList = await superAdminService.getAllAdmins();
      setAdmins(adminList);
    } catch (err) {
      setError('Failed to fetch admin list');
    } finally {
      setLoading(false);
    }
  }, []);

  const inviteAdmin = useCallback(async (inviteData: InviteAdminData): Promise<AuthResponse> => {
    const result = await superAdminService.inviteAdmin(inviteData);
    if (result.success) {
      await fetchAdmins(); // Refresh the list
    }
    return result;
  }, [fetchAdmins]);

  const updateAdminStatus = useCallback(async (email: string, status: string): Promise<AuthResponse> => {
    const result = await superAdminService.updateAdminStatus(email, status);
    if (result.success) {
      await fetchAdmins(); // Refresh the list
    }
    return result;
  }, [fetchAdmins]);

  const deleteAdmin = useCallback(async (email: string): Promise<AuthResponse> => {
    const result = await superAdminService.deleteAdmin(email);
    if (result.success) {
      await fetchAdmins(); // Refresh the list
    }
    return result;
  }, [fetchAdmins]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  return {
    admins,
    loading,
    error,
    inviteAdmin,
    updateAdminStatus,
    deleteAdmin,
    refresh: fetchAdmins,
  };
};

// Hook for form validation
export const useFormValidation = (initialValues: Record<string, string>) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = useCallback((field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback((field: string, value: string, rules: ValidationRule) => {
    let error = '';
    
    if (rules.required && !value.trim()) {
      error = `${field} is required`;
    } else if (rules.email && value && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Invalid email address';
    } else if (rules.phone && value && !/^\+?[\d\s-()]+$/.test(value)) {
      error = 'Invalid phone number';
    } else if (rules.minLength && value.length < rules.minLength) {
      error = `${field} must be at least ${rules.minLength} characters`;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  }, []);

  const validateForm = useCallback((validationRules: Record<string, ValidationRule>) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(field => {
      const isFieldValid = validateField(field, values[field] || '', validationRules[field]);
      if (!isFieldValid) {
        isValid = false;
      }
    });
    
    return isValid;
  }, [values, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
  };
};

export default {
  useAdminAuth,
  useSuperAdminAuth,
  useAdminDashboard,
  useAdminStats,
  useSuperAdminStats,
  useAdminManagement,
  useFormValidation,
};
