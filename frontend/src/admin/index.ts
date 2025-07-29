// Admin Module Index - CleanKili Admin Panel
// This file provides a centralized export for all admin-related components, hooks, services, and types

// Components
export { default as AdminLogin } from './components/AdminLogin';
export { default as AdminRegistration } from './components/AdminRegistration';
export { default as AdminLiveMap } from './components/AdminLiveMap';
export { default as AdminDemo } from './components/AdminDemo';
export { default as SuperAdminLogin } from './components/SuperAdminLogin';
export { default as SuperAdminPanel } from './components/SuperAdminPanel';

// Dashboard Components
export { default as AdminActions } from './dashboard/AdminActions';
export { default as ReportsOverview } from './dashboard/ReportsOverview';
export { default as ReportsManagement } from './dashboard/ReportsManagement';
export { default as StatusUpdates } from './dashboard/StatusUpdates';
export { default as TrendsInsights } from './dashboard/TrendsInsights';
export { default as AssignManage } from './dashboard/AssignManage';
export { default as HelpSupport } from './dashboard/HelpSupport';

// Pages
export { default as AdminLoginPage } from './pages/AdminLogin';
export { default as AdminRegisterPage } from './pages/AdminRegister';
export { default as AdminPortalPage } from './pages/AdminPortal';
export { default as DashboardPage } from './pages/Dashboard';

// Services
export { adminService, superAdminService } from './services';

// Hooks
export {
  useAdminAuth,
  useSuperAdminAuth,
  useAdminDashboard,
  useAdminStats,
  useSuperAdminStats,
  useAdminManagement,
  useFormValidation,
} from './hooks';

// Types
export type {
  AdminUser,
  LoginFormData,
  RegisterFormData,
  AuthResponse,
  AdminStats,
  InviteAdminData,
  AdminInvitation,
  ReportData,
  DashboardData,
  AdminActivity,
  VerificationData,
  AdminPermissions,
  AdminRole,
  ReportStatus,
  ReportPriority,
  ValidationRule,
} from './types';

// Default export - main admin service
export { default } from './services';
