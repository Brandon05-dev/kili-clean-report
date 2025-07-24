# CleanKili Super Admin Management System

## 🎯 Overview

The CleanKili Super Admin Management System provides secure API endpoints for managing Super Admins within the environmental reporting platform. This system implements robust security measures to ensure only authorized Super Admins can create or remove other Super Admins.

## 🔐 Security Features

- **JWT Authentication**: All endpoints require valid JWT tokens
- **Role-Based Access**: Only Super Admins can access these endpoints
- **Password Hashing**: bcrypt with 12 salt rounds for maximum security
- **Self-Protection**: Prevents Super Admins from deleting/deactivating themselves
- **Last Admin Protection**: Prevents deletion of the last remaining Super Admin
- **Audit Logging**: All actions are logged for security auditing
- **Input Validation**: Comprehensive validation using Joi schemas

## 📚 API Endpoints

### 1. Create Super Admin
**POST** `/api/super-admins`

Creates a new Super Admin account with email and SMS verification.

#### Request Body
```json
{
  "email": "superadmin@cleankili.com",
  "phoneNumber": "+1234567890",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Response
```json
{
  "success": true,
  "message": "Super Admin created successfully. Verification email and SMS sent.",
  "data": {
    "id": "uuid",
    "email": "superadmin@cleankili.com",
    "phone": "+1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Super Admin",
    "status": "INVITED",
    "isActive": true,
    "isVerified": false,
    "createdAt": "2025-01-XX",
    "verificationLink": "https://app.cleankili.com/admin/verify-account?token=..."
  }
}
```

#### Process Flow
1. ✅ Validate input data (email format, phone format, password strength)
2. ✅ Check for existing email/phone conflicts
3. ✅ Hash password with bcrypt (12 rounds)
4. ✅ Create admin record with role='Super Admin' and status='INVITED'
5. ✅ Send welcome email with verification link
6. ✅ Send SMS with 6-digit OTP code
7. ✅ Log creation action for audit trail

### 2. Delete Super Admin
**DELETE** `/api/super-admins/:id`

Removes a Super Admin from the system with safety checks.

#### Response
```json
{
  "success": true,
  "message": "Super Admin John Doe deleted successfully",
  "data": {
    "deletedAdmin": {
      "id": "uuid",
      "email": "superadmin@cleankili.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "deletedBy": {
      "id": "uuid",
      "email": "current-admin@cleankili.com"
    },
    "deletedAt": "2025-01-XX"
  }
}
```

#### Safety Checks
- ❌ Cannot delete yourself
- ❌ Cannot delete the last remaining Super Admin
- ✅ Must be an existing Super Admin
- ✅ Action is logged for audit trail

### 3. List All Super Admins
**GET** `/api/super-admins`

Retrieves all Super Admin accounts.

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "admin1@cleankili.com",
      "phone": "+1234567890",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Super Admin",
      "status": "ACTIVE",
      "isActive": true,
      "isVerified": true,
      "createdAt": "2025-01-XX",
      "lastLogin": "2025-01-XX",
      "invitedBy": "uuid"
    }
  ],
  "meta": {
    "total": 2
  }
}
```

### 4. Update Super Admin Status
**PUT** `/api/super-admins/:id/status`

Updates the status of a Super Admin (ACTIVE/DEACTIVATED).

#### Request Body
```json
{
  "status": "DEACTIVATED"
}
```

#### Response
```json
{
  "success": true,
  "message": "Super Admin status updated to DEACTIVATED",
  "data": {
    "id": "uuid",
    "email": "admin@cleankili.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Super Admin",
    "status": "DEACTIVATED",
    "isActive": false,
    "updatedAt": "2025-01-XX"
  }
}
```

## 🗃️ Database Schema Updates

### Admins Table
The `admins` table has been enhanced with a `status` field:

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  passwordHash TEXT NOT NULL,
  role admin_role NOT NULL DEFAULT 'Admin',
  status TEXT NOT NULL DEFAULT 'ACTIVE' 
    CHECK (status IN ('INVITED', 'ACTIVE', 'DEACTIVATED')),
  isActive BOOLEAN NOT NULL DEFAULT true,
  isVerified BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ,
  lastLogin TIMESTAMPTZ,
  invitedBy UUID REFERENCES admins(id)
);
```

### Status Values
- **INVITED**: Newly created, awaiting verification
- **ACTIVE**: Verified and can access the system
- **DEACTIVATED**: Temporarily disabled access

## 🔧 Setup Instructions

### 1. Database Migration
If you have an existing database, run this migration:

```sql
-- Add status column to existing admins table
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACTIVE' 
CHECK (status IN ('INVITED', 'ACTIVE', 'DEACTIVATED'));

-- Update existing records
UPDATE admins SET status = 'ACTIVE' WHERE status IS NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_admins_status ON admins(status);
```

### 2. Environment Variables
Add these to your `.env` file:

```env
# JWT Secret for authentication
JWT_SECRET=your-super-secure-jwt-secret-here

# Frontend URL for verification links
FRONTEND_URL=https://app.cleankili.com

# Notification settings (optional)
ADMIN_PHONE_NUMBERS=+1234567890,+0987654321
ADMIN_WHATSAPP_NUMBERS=+1234567890,+0987654321
```

### 3. Create First Super Admin
You'll need to manually create the first Super Admin in your database:

```sql
INSERT INTO admins (
  id,
  email,
  phone,
  firstName,
  lastName,
  passwordHash,
  role,
  status,
  isActive,
  isVerified,
  createdAt
) VALUES (
  uuid_generate_v4(),
  'first-admin@cleankili.com',
  '+1234567890',
  'First',
  'Admin',
  -- Password hash for 'TempPassword123!' (change this!)
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewUUc.T8zfRWOgMq',
  'Super Admin',
  'ACTIVE',
  true,
  true,
  NOW()
);
```

## 🧪 Testing

### Example cURL Commands

#### Create Super Admin
```bash
curl -X POST http://localhost:5000/api/super-admins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "newadmin@cleankili.com",
    "phoneNumber": "+1234567890",
    "password": "SecurePass123!",
    "firstName": "New",
    "lastName": "Admin"
  }'
```

#### Delete Super Admin
```bash
curl -X DELETE http://localhost:5000/api/super-admins/ADMIN_UUID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### List Super Admins
```bash
curl -X GET http://localhost:5000/api/super-admins \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛡️ Security Best Practices

1. **Strong Passwords**: Enforce complex password requirements
2. **Regular Audits**: Review admin creation/deletion logs
3. **Principle of Least Privilege**: Only grant Super Admin access when necessary
4. **Account Monitoring**: Track login patterns and suspicious activities
5. **Backup Verification**: Always maintain at least one active Super Admin
6. **Environment Security**: Keep JWT secrets and environment variables secure

## 🚨 Error Handling

The system provides detailed error responses:

```json
{
  "success": false,
  "error": "Cannot delete the last remaining Super Admin",
  "details": "At least one Super Admin must exist."
}
```

Common error scenarios:
- **409 Conflict**: Email/phone already exists
- **400 Bad Request**: Invalid input data or business rule violation
- **401 Unauthorized**: Invalid or missing JWT token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Super Admin not found
- **500 Internal Server Error**: Database or system errors

## 📊 Audit Trail

All Super Admin operations are logged to the `notification_logs` table with type `admin_action` for security auditing and compliance tracking.

## 🔄 Future Enhancements

- [ ] Two-factor authentication (2FA) requirement
- [ ] IP whitelist restrictions
- [ ] Session management and forced logout
- [ ] Admin activity dashboard
- [ ] Bulk operations for admin management
- [ ] Role-based permission granularity
- [ ] Integration with enterprise SSO systems

---

**⚠️ Important**: Always test these endpoints in a development environment before deploying to production. The deletion of Super Admins is irreversible, so implement additional safeguards as needed for your specific use case.
