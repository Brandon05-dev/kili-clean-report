// API Configuration for CleanKili Frontend
// This file handles environment-specific API endpoints

const getApiUrl = (): string => {
  // In production, use the environment variable or fall back to a default
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com';
  }
  
  // In development, use local backend
  return import.meta.env.VITE_API_URL || 'http://localhost:5001';
};

const getWebSocketUrl = (): string => {
  const apiUrl = getApiUrl();
  // Convert HTTP to WebSocket URL
  return apiUrl.replace(/^http/, 'ws');
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  WS_URL: getWebSocketUrl(),
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Reports
  REPORTS: '/api/reports',
  REPORT_STATS: '/api/reports/stats',
  REPORT_STATS_OVERVIEW: '/api/reports/stats/overview',
  
  // Admin
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_REGISTER: '/api/admin/register',
  ADMIN_VERIFY_EMAIL: '/api/admin/verify-email',
  ADMIN_VERIFY_PHONE: '/api/admin/verify-phone',
  ADMIN_RESEND_EMAIL: '/api/admin/resend-email',
  ADMIN_RESEND_SMS: '/api/admin/resend-sms',
  
  // Super Admin
  SUPER_ADMIN_LOGIN: '/api/super-admin/login',
  SUPER_ADMIN_LOGOUT: '/api/super-admin/logout',
  SUPER_ADMIN_STATS: '/api/super-admin/stats',
  SUPER_ADMIN_ADMINS: '/api/super-admin/admins',
  SUPER_ADMIN_INVITE: '/api/super-admin/invite',
  
  // Testing
  TEST_CONNECTIVITY: '/api/test-connectivity',
  TEST_DAILY_SUMMARY: '/api/test-daily-summary',
  TEST_ALERT: '/api/test-alert',
  
  // Health
  HEALTH: '/health',
} as const;

// Utility function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Utility function for fetch with default config
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};

export default API_CONFIG;
