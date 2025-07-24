# 🔐 CleanKili Super Admin System Documentation

## 📌 Overview

The CleanKili Super Admin system implements a secure, invite-only administration panel with role-based access control. This system ensures that only verified administrators can access the environmental reporting system and manage critical operations.

## 🏗️ Architecture

### Security Model
- **Hidden Routes**: No public links to admin panels
- **Role-Based Access**: SUPER_ADMIN and ADMIN roles with different permissions
- **Invite-Only**: No public registration - admins can only be invited by Super Admins
- **Dual Verification**: Email + SMS verification for all invitations
- **Secure Authentication**: JWT tokens with HTTP-only cookies

### Routes
- **Public Site**: `cleankili.org`
- **Super Admin Login**: `cleankili.org/super-admin-login` (hidden)
- **Super Admin Panel**: `cleankili.org/super-admin` (protected)
- **Admin Dashboard**: `cleankili.org/admin/dashboard` (protected)
- **Invitation Completion**: `cleankili.org/admin/complete-invite?token=...`

## 🚀 Initial Setup

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Required for email invitations
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@cleankili.org

# Required for SMS verification
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_SMS_NUMBER=+1234567890

# Required for authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=24h

# Optional: reCAPTCHA (recommended)
RECAPTCHA_SECRET_KEY=your-recaptcha-secret
```

### 2. Create First Super Admin

⚠️ **IMPORTANT**: Update credentials in `src/scripts/seedSuperAdmin.ts` before running!

```bash
cd backend
npm run seed-super-admin
```

This creates the initial Super Admin account with:
- Full system access
- Ability to invite other admins
- Access to all management features

### 3. Access Super Admin Panel

1. Visit: `http://localhost:5173/super-admin-login`
2. Login with the credentials from the seeding script
3. **Immediately change the default password**
4. Start inviting other administrators

## 👥 Admin Management Flow

### Super Admin Capabilities
- ✅ View all admin accounts and their status
- ✅ Invite new admins (ADMIN or SUPER_ADMIN role)
- ✅ Suspend/reactivate admin accounts
- ✅ Remove admin accounts permanently
- ✅ View activity logs and system statistics
- ✅ Access all admin dashboard features

### Admin Invitation Process

1. **Super Admin sends invitation**:
   - Enters name, email, phone, and role
   - System generates secure invitation token
   - Email sent with invitation link
   - SMS sent with 6-digit OTP

2. **Invited user receives**:
   - Email with unique invitation link
   - SMS with verification code (expires in 15 minutes)
   - Invitation expires in 7 days

3. **User completes setup**:
   - Clicks email invitation link
   - Enters SMS verification code
   - Creates secure password
   - Account status changes to ACTIVE

4. **Admin gains access**:
   - Can login to admin dashboard
   - Receives WhatsApp/SMS environmental alerts
   - Can manage environmental reports

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure, stateless authentication
- **HTTP-Only Cookies**: Protection against XSS attacks
- **Role-Based Access Control**: Different permissions for ADMIN vs SUPER_ADMIN
- **Session Management**: Configurable timeout and security settings

### Password Security
- **bcrypt Hashing**: Industry-standard password hashing
- **Strong Password Requirements**:
  - Minimum 8 characters
  - Uppercase and lowercase letters
  - Numbers and special characters
  - Cannot be common passwords

### Communication Security
- **Email Verification**: Token-based email confirmation
- **SMS Verification**: Time-limited OTP codes
- **Secure Invitations**: Unique tokens with expiration
- **Audit Logging**: All admin actions are logged

### Protection Measures
- **No Public Registration**: Only invite-based admin creation
- **Hidden Routes**: Admin panels not linked from public pages
- **Input Validation**: All inputs sanitized and validated
- **Rate Limiting**: Protection against brute force attacks
- **HTTPS Required**: Secure communication in production

## 📊 API Endpoints

### Super Admin Routes (`/api/super-admin/`)

#### Authentication
- `POST /login` - Super Admin login
- `POST /logout` - Secure logout
- `GET /verify-session` - Verify current session

#### Admin Management
- `GET /stats` - Dashboard statistics
- `GET /admins` - List all administrators
- `POST /invite` - Invite new administrator
- `PUT /admins/:email/status` - Update admin status
- `DELETE /admins/:email` - Remove administrator

#### Invitation Handling
- `POST /complete-invite` - Complete invitation setup

## 🎯 Admin Status Flow

```
INVITED → PENDING_VERIFICATION → ACTIVE → SUSPENDED/DEACTIVATED
   ↑              ↓                  ↑            ↓
   └── Email sent  └── SMS verified  └── Login enabled
```

### Status Definitions
- **INVITED**: Invitation sent, awaiting response
- **PENDING_VERIFICATION**: Email clicked, awaiting SMS verification
- **ACTIVE**: Full access to admin features
- **SUSPENDED**: Temporarily disabled, can be reactivated
- **DEACTIVATED**: Permanently disabled

## 🔧 Technical Implementation

### Database Schema (Firestore)

#### Admins Collection (`admins`)
```typescript
{
  id: string;
  name: string;
  email: string; // Document ID
  phone: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  status: 'INVITED' | 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  passwordHash: string;
  emailVerifiedAt: Date;
  phoneVerifiedAt: Date;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Admin Invites Collection (`admin_invites`)
```typescript
{
  id: string;
  email: string;
  invitationToken: string;
  phoneOtp: string;
  otpExpiry: Date;
  invitationExpiry: Date;
  status: 'SENT' | 'EMAIL_VERIFIED' | 'PHONE_VERIFIED' | 'COMPLETED' | 'EXPIRED';
  createdAt: Date;
}
```

#### Admin Actions Collection (`admin_actions`)
```typescript
{
  id: string;
  adminId: string;
  action: 'INVITE_SENT' | 'ADMIN_ACTIVATED' | 'ADMIN_SUSPENDED' | 'LOGIN';
  details: string;
  timestamp: Date;
}
```

### Frontend Components

#### Core Components
- `SuperAdminLogin.tsx` - Secure login interface
- `SuperAdminPanel.tsx` - Main administration dashboard
- `CompleteInvitation.tsx` - Invitation completion flow

#### Key Features
- **Responsive Design**: Works on all device sizes
- **Real-time Updates**: Live status updates and notifications
- **Intuitive UI**: Easy-to-use admin management interface
- **Security Indicators**: Visual security status and requirements

## 🚨 Security Best Practices

### For Super Admins
1. **Strong Passwords**: Use unique, complex passwords
2. **Regular Updates**: Change passwords regularly
3. **Secure Environment**: Access only from trusted devices/networks
4. **Monitor Activity**: Review admin actions and logs regularly
5. **Principle of Least Privilege**: Only grant necessary permissions

### For System Administrators
1. **HTTPS Only**: Always use HTTPS in production
2. **Environment Variables**: Store all secrets in environment variables
3. **Regular Backups**: Backup admin data and configurations
4. **Update Dependencies**: Keep all packages updated
5. **Monitor Logs**: Watch for suspicious activity

### For Invited Admins
1. **Verify Invitations**: Ensure invitations are from trusted sources
2. **Secure Setup**: Complete setup from secure, private networks
3. **Strong Passwords**: Create unique, complex passwords
4. **Report Issues**: Report any suspicious activity immediately

## 📱 Integration with Alert System

Once admins complete verification, they automatically:
- ✅ Receive WhatsApp notifications for new environmental reports
- ✅ Get SMS fallback if WhatsApp fails
- ✅ Receive daily AI-powered summary reports
- ✅ Get emergency alerts for high-priority incidents

## 🔄 Maintenance & Operations

### Regular Tasks
- Monitor admin activity logs
- Review and remove inactive admin accounts
- Update security configurations
- Backup admin data
- Review and rotate JWT secrets

### Troubleshooting
- Check environment variable configuration
- Verify email/SMS service connectivity
- Review Firestore security rules
- Monitor application logs
- Test invitation flow regularly

## 📞 Support & Contact

For technical support or security concerns:
- Email: tech@cleankili.org
- Emergency: Contact system administrator immediately
- Documentation: Check this file and code comments

---

**Remember**: This system handles sensitive environmental data and admin access. Always prioritize security and follow best practices!
