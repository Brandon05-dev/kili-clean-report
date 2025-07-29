# CleanKili Admin Module

This directory contains all admin-related functionality for the CleanKili application, organized into a clean, modular structure.

## 📁 Directory Structure

```
src/admin/
├── components/          # Admin UI components
│   ├── AdminLogin.tsx
│   ├── AdminRegistration.tsx
│   ├── AdminLiveMap.tsx
│   ├── AdminDemo.tsx
│   ├── SuperAdminLogin.tsx
│   └── SuperAdminPanel.tsx
├── dashboard/           # Dashboard-specific components
│   ├── AdminActions.tsx
│   ├── ReportsOverview.tsx
│   ├── ReportsManagement.tsx
│   ├── StatusUpdates.tsx
│   ├── TrendsInsights.tsx
│   ├── AssignManage.tsx
│   └── HelpSupport.tsx
├── pages/              # Admin page components
│   ├── AdminLogin.tsx
│   ├── AdminRegister.tsx
│   ├── AdminPortal.tsx
│   └── Dashboard.tsx
├── services/           # Admin API services
│   └── index.ts
├── hooks/              # Admin custom hooks
│   └── index.ts
├── types/              # Admin TypeScript types
│   └── index.ts
└── index.ts            # Module exports
```

## 🔧 Components

### Authentication Components
- **AdminLogin**: Login form for admin users
- **AdminRegistration**: Registration form for new admins
- **SuperAdminLogin**: Super admin login form
- **SuperAdminPanel**: Super admin control panel

### Dashboard Components
- **AdminLiveMap**: Real-time map interface for admins
- **AdminDemo**: Demo functionality for admin features
- **ReportsOverview**: Overview of all reports
- **ReportsManagement**: Manage and process reports
- **StatusUpdates**: Update report statuses
- **TrendsInsights**: Analytics and trends
- **AssignManage**: Assign reports to team members
- **HelpSupport**: Admin help and support

## 🎣 Hooks

### Authentication Hooks
- **useAdminAuth**: Admin authentication state management
- **useSuperAdminAuth**: Super admin authentication
- **useFormValidation**: Form validation utilities

### Data Hooks
- **useAdminDashboard**: Dashboard data management
- **useAdminStats**: Statistics and metrics
- **useSuperAdminStats**: Super admin statistics
- **useAdminManagement**: Admin user management

## 🔌 Services

### AdminService
- User authentication and authorization
- Profile management
- Dashboard data fetching
- Report management

### SuperAdminService
- Admin user management
- System-wide statistics
- Invitation management
- Administrative controls

## 📊 Types

Comprehensive TypeScript definitions for:
- Admin user data structures
- Authentication responses
- Form data types
- API responses
- Statistics and metrics
- Validation rules

## 🚀 Usage

### Import Components
```tsx
import { AdminLogin, AdminDashboard } from '@/admin';
```

### Use Hooks
```tsx
import { useAdminAuth, useAdminStats } from '@/admin';

const MyComponent = () => {
  const { user, login, logout } = useAdminAuth();
  const { stats, loading } = useAdminStats();
  
  // Component logic
};
```

### Use Services
```tsx
import { adminService } from '@/admin';

const handleLogin = async (email: string, password: string) => {
  const result = await adminService.login({ email, password });
  // Handle result
};
```

## 🔐 Authentication Flow

1. **Admin Login**: Regular admin authentication
2. **Email Verification**: Email confirmation for new accounts
3. **Phone Verification**: SMS verification for enhanced security
4. **Super Admin**: Enhanced privileges for system management

## 📱 Features

- **Role-based Access Control**: Different permission levels
- **Real-time Updates**: Live data and notifications
- **Report Management**: Complete report lifecycle
- **Analytics Dashboard**: Insights and trends
- **User Management**: Admin invitation and management
- **Multi-channel Support**: WhatsApp, email, web integration

## 🛡️ Security

- JWT token-based authentication
- Role-based permissions
- Input validation and sanitization
- Secure API communication
- Session management

## 🔄 State Management

Uses React hooks for local state and authentication state management. No external state management library required for the admin module.

## 📋 Best Practices

1. **Type Safety**: All components use TypeScript with proper typing
2. **Error Handling**: Comprehensive error handling and user feedback
3. **Loading States**: Proper loading indicators for async operations
4. **Validation**: Client-side and server-side validation
5. **Accessibility**: ARIA labels and keyboard navigation support
6. **Responsive Design**: Mobile-friendly admin interface
