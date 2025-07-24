# 🔑 CleanKili Super Admin Management System

## 🎯 Overview

A secure Express.js API system for managing Super Admins in the CleanKili environmental reporting platform. This implementation provides robust security features including password hashing, JWT authentication, role-based access control, and comprehensive audit logging.

## ✅ Features Implemented

### 🔐 Security Features
- **JWT Authentication**: All endpoints protected with Bearer tokens
- **bcrypt Password Hashing**: 12-round salt for maximum security
- **Role-Based Access Control**: Only Super Admins can manage other Super Admins
- **Self-Protection**: Prevents Super Admins from deleting/deactivating themselves
- **Last Admin Protection**: Prevents deletion of the final remaining Super Admin
- **Input Validation**: Comprehensive Joi schema validation
- **Audit Logging**: All actions logged for security compliance

### 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/super-admins` | Create new Super Admin | Super Admin |
| `GET` | `/api/super-admins` | List all Super Admins | Super Admin |
| `DELETE` | `/api/super-admins/:id` | Delete Super Admin | Super Admin |
| `PUT` | `/api/super-admins/:id/status` | Update Super Admin status | Super Admin |

### 🗃️ Database Schema
- Enhanced `admins` table with `status` field
- Three status states: `INVITED`, `ACTIVE`, `DEACTIVATED`
- Full constraint validation and indexing

## 🚀 Quick Start

### 1. Database Setup

Run the migration to add the status column:
```sql
-- Add to existing Supabase database
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACTIVE' 
CHECK (status IN ('INVITED', 'ACTIVE', 'DEACTIVATED'));
```

### 2. Environment Configuration

Add to your `.env` file:
```env
JWT_SECRET=your-super-secure-jwt-secret-here
FRONTEND_URL=https://app.cleankili.com
```

### 3. Create First Super Admin

Run the bootstrap script:
```bash
npm run create-first-super-admin
```

Or manually set environment variables:
```bash
FIRST_SUPER_ADMIN_EMAIL=admin@cleankili.com \
FIRST_SUPER_ADMIN_PHONE=+1234567890 \
FIRST_SUPER_ADMIN_PASSWORD=SecurePass123! \
FIRST_SUPER_ADMIN_FIRST_NAME=John \
FIRST_SUPER_ADMIN_LAST_NAME=Doe \
npm run create-first-super-admin
```

### 4. Start the Server

```bash
npm run dev
```

## 📋 API Usage Examples

### Create Super Admin
```bash
curl -X POST http://localhost:5000/api/super-admins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "newadmin@cleankili.com",
    "phoneNumber": "+1234567890",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### List Super Admins
```bash
curl -X GET http://localhost:5000/api/super-admins \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Status
```bash
curl -X PUT http://localhost:5000/api/super-admins/ADMIN_UUID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status": "DEACTIVATED"}'
```

### Delete Super Admin
```bash
curl -X DELETE http://localhost:5000/api/super-admins/ADMIN_UUID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 Testing

Run the comprehensive test suite:
```bash
# Set test credentials in environment
export TEST_SUPER_ADMIN_EMAIL=admin@cleankili.com
export TEST_SUPER_ADMIN_PASSWORD=SecurePass123!

# Run tests
npm run test-super-admin
```

The test suite covers:
- ✅ Super Admin creation
- ✅ Super Admin listing
- ✅ Status updates
- ✅ Self-deletion prevention
- ✅ Super Admin deletion
- ✅ Error handling

## 🛡️ Security Considerations

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@$!%*?&)

### Safety Mechanisms
- Cannot delete yourself
- Cannot delete the last remaining Super Admin
- Email and phone uniqueness validation
- International phone number format validation
- All actions are logged for audit purposes

### Token Security
- JWT tokens expire after configured time
- Tokens include role information
- Bearer token authentication required

## 📁 File Structure

```
backend/
├── src/
│   ├── routes/
│   │   └── superAdmin.ts           # Super Admin API endpoints
│   ├── middleware/
│   │   ├── auth.ts                # Authentication middleware
│   │   └── validation.ts          # Input validation schemas
│   ├── services/
│   │   └── notificationService.ts # Email/SMS notifications
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── database/
│   ├── schema.sql                 # Updated database schema
│   └── migrations/
│       └── add_admin_status_column.sql
├── scripts/
│   └── createFirstSuperAdmin.ts   # Bootstrap script
├── tests/
│   └── superAdminTests.ts         # Comprehensive test suite
└── docs/
    └── SUPER_ADMIN_SYSTEM_COMPLETE.md
```

## 🔄 Workflow

### Creating a Super Admin
1. **Validate Input**: Email, phone, password requirements
2. **Check Duplicates**: Ensure email/phone uniqueness
3. **Hash Password**: bcrypt with 12 rounds
4. **Create Record**: Insert with status='INVITED'
5. **Send Notifications**: Welcome email + SMS verification
6. **Log Action**: Audit trail entry

### Deleting a Super Admin
1. **Authenticate**: Verify Super Admin token
2. **Safety Checks**: Prevent self-deletion and last admin deletion
3. **Verify Target**: Ensure target exists and is Super Admin
4. **Execute Deletion**: Remove from database
5. **Log Action**: Audit trail with full details

## 🚨 Error Handling

The system provides detailed error responses with appropriate HTTP status codes:

- `400 Bad Request`: Invalid input or business rule violations
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate email/phone numbers
- `500 Internal Server Error`: Database or system errors

## 📊 Monitoring & Auditing

All Super Admin operations are logged to the `notification_logs` table with:
- Action type: `admin_action`
- Timestamp
- Acting user details
- Target user details
- Action performed

## 🔮 Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] IP address restrictions
- [ ] Session management
- [ ] Bulk operations
- [ ] Admin activity dashboard
- [ ] SSO integration

## 🆘 Troubleshooting

### Common Issues

**"Cannot delete the last remaining Super Admin"**
- This is a safety feature. Ensure at least 2 Super Admins exist before deletion.

**"Invalid JWT token"**
- Check token format and ensure it's included in Authorization header as `Bearer <token>`

**"Password does not meet requirements"**
- Verify password contains uppercase, lowercase, number, and special character

**"Email already exists"**
- Each Super Admin must have a unique email address

## 📞 Support

For issues or questions:
1. Check the logs in `notification_logs` table
2. Verify environment variables are set correctly
3. Ensure database schema is up to date
4. Run the test suite to verify functionality

---

**🚨 Important**: Always test in a development environment first. Super Admin deletion is irreversible, so implement additional safeguards as needed for your production environment.
