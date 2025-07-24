# CleanKili Backend

A secure Node.js Express backend with Supabase for the CleanKili community environmental reporting system.

## 🚀 Features

### Core Functionality
- **Report Management**: Accept and manage community environmental reports
- **Real-time Notifications**: Instant WhatsApp & SMS alerts to admins
- **Daily AI Summaries**: Automated daily reports with OpenAI integration
- **Admin System**: Secure invite-only admin management
- **Dashboard Analytics**: Comprehensive reporting and statistics

### Technical Features
- **Express.js**: Fast, unopinionated web framework
- **Supabase**: PostgreSQL database with real-time capabilities
- **TypeScript**: Type-safe development
- **JWT Authentication**: Secure admin authentication
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Robust error management
- **Scheduled Tasks**: Automated daily summaries

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Twilio account (for SMS/WhatsApp)
- OpenAI API key (optional, for AI summaries)

## 🛠️ Installation

1. **Clone and navigate to backend**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```

3. **Configure Environment Variables**:
   Edit `.env` with your actual credentials:
   ```env
   # Supabase
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # JWT
   JWT_SECRET=your_super_secret_jwt_key

   # Twilio
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

   # OpenAI (optional)
   OPENAI_API_KEY=your_openai_api_key

   # Admin Contacts
   ADMIN_PHONE_NUMBERS=+254700000000,+254700000001
   ADMIN_WHATSAPP_NUMBERS=+254700000000,+254700000001
   ```

4. **Database Setup**:
   - Go to your Supabase project's SQL Editor
   - Run `database/schema.sql` to create tables
   - Run `database/sample_data.sql` to insert sample data (optional)

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📊 Database Schema

### Reports Table
```sql
reports (
  id UUID PRIMARY KEY,
  description TEXT NOT NULL,
  photoUrl TEXT,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  status ENUM('Pending', 'In Progress', 'Resolved', 'Rejected'),
  category ENUM('Waste Management', 'Water Pollution', ...),
  priority ENUM('Low', 'Medium', 'High', 'Critical'),
  address TEXT,
  reporterEmail TEXT,
  reporterPhone TEXT,
  adminNotes TEXT,
  assignedTo UUID REFERENCES admins(id),
  createdAt TIMESTAMPTZ,
  updatedAt TIMESTAMPTZ
)
```

### Admins Table
```sql
admins (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  passwordHash TEXT NOT NULL,
  role ENUM('Super Admin', 'Admin', 'Moderator'),
  isActive BOOLEAN DEFAULT true,
  isVerified BOOLEAN DEFAULT false,
  createdAt TIMESTAMPTZ,
  lastLogin TIMESTAMPTZ
)
```

## 🔐 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/reports` - Create new report
- `GET /api/reports` - Get all reports (public view)
- `GET /api/reports/:id` - Get specific report
- `GET /api/reports/stats/summary` - Get public statistics

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/invite` - Invite new admin (Super Admin only)
- `GET /api/auth/invitation/:token` - Get invitation details
- `POST /api/auth/complete-invitation` - Complete admin registration
- `POST /api/auth/send-verification` - Send phone verification code

### Admin Endpoints (Authenticated)
- `GET /api/admin/reports` - Get all reports (admin view)
- `PUT /api/admin/reports/:id` - Update report
- `DELETE /api/admin/reports/:id` - Delete report (Super Admin only)
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/admins` - Get all admins (Super Admin only)
- `PUT /api/admin/admins/:id/status` - Update admin status
- `POST /api/admin/daily-summary/trigger` - Trigger daily summary
- `GET /api/admin/daily-summaries` - Get daily summaries

## 🔒 Security Features

- **JWT Authentication**: Secure admin sessions
- **Row Level Security**: Supabase RLS policies
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcrypt with 12 salt rounds
- **CORS Protection**: Configurable origins
- **Helmet**: Security headers
- **Request Size Limits**: 10MB max payload

## 📱 Notification System

### SMS & WhatsApp Alerts
- **New Report Alerts**: Instant notifications to all admins
- **Status Updates**: Notifications when report status changes
- **Daily Summaries**: Automated daily reports at 11:59 PM
- **Error Notifications**: System error alerts

### Message Templates
```
🚨 NEW ENVIRONMENTAL REPORT

ID: [report-id]
Description: [description]
Location: [location]

Please review and take action via the CleanKili Admin Dashboard.
```

## 🤖 AI Integration

### Daily Summary Generation
- **OpenAI GPT-4**: Intelligent summary generation
- **Fallback Template**: Template-based summaries when AI unavailable
- **Scheduled Execution**: Daily at 11:59 PM (Africa/Nairobi timezone)
- **Data Analysis**: Trends, top locations, critical alerts

### Sample AI Summary
```
📊 CleanKili Daily Report - 2024-01-15

📈 OVERVIEW:
Yesterday's environmental report shows 8 total incidents with 4 pending 
issues requiring immediate attention. Critical alerts include sewage 
overflow in Kibera and chemical spill in Ruaraka. The Nairobi CBD area 
shows highest activity with illegal dumping being the primary concern. 
Resolution rate stands at 25% with 2 of 8 reports successfully addressed.

⚠️ Action Required: 4 reports pending review
```

## 🕐 Scheduled Tasks

### Daily Summary Scheduler
- **Frequency**: Daily at 11:59 PM
- **Timezone**: Africa/Nairobi
- **Actions**:
  1. Query today's reports
  2. Generate statistics
  3. Create AI summary
  4. Save to database
  5. Send notifications

### Manual Triggers
- Admins can manually trigger daily summaries
- Useful for testing and catch-up reports

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Create Test Report
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test environmental issue",
    "lat": -1.2921,
    "lng": 36.8219,
    "category": "Other"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cleankili.org",
    "password": "SuperAdmin123!"
  }'
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com
# ... other production configs
```

### Recommended Deployment Platforms
- **Railway**: Easy Node.js deployment
- **Heroku**: Traditional PaaS
- **DigitalOcean App Platform**: Modern deployment
- **AWS/GCP/Azure**: Enterprise solutions

## 📝 Logging

### Development
- **Morgan**: HTTP request logging
- **Console**: Detailed error logging

### Production
- **Combined Format**: Standard Apache combined log format
- **Error Tracking**: Comprehensive error logging
- **Notification Logs**: SMS/WhatsApp delivery tracking

## 🔧 Configuration

### Rate Limiting
```javascript
// Default: 100 requests per 15 minutes
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### File Upload Limits
```javascript
MAX_FILE_SIZE=10485760  // 10MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp
```

### JWT Configuration
```javascript
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check Supabase URL and keys
   - Verify network connectivity
   - Check RLS policies

2. **SMS/WhatsApp Not Sending**
   - Verify Twilio credentials
   - Check phone number formats
   - Validate account balance

3. **AI Summaries Not Working**
   - Check OpenAI API key
   - Verify API quota
   - Check fallback template

4. **Authentication Issues**
   - Verify JWT secret configuration
   - Check token expiration
   - Validate admin status

### Debug Mode
Set `NODE_ENV=development` for detailed logging.

## 📚 API Documentation

For detailed API documentation with request/response examples, see the `/docs` folder or use tools like Postman with the provided collection.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@cleankili.org
- Documentation: [Link to docs]
- Issues: [GitHub Issues]
