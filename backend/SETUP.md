# CleanKili Backend Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

3. **Database Setup**
   - Create a Supabase project at https://supabase.com
   - Go to Project Settings → API
   - Copy your Project URL and API Keys
   - In Supabase SQL Editor, run:
     - `database/schema.sql`
     - `database/sample_data.sql` (optional)

4. **Twilio Setup** (for notifications)
   - Create account at https://twilio.com
   - Get Account SID, Auth Token, and Phone Number
   - For WhatsApp: Enable Twilio Sandbox

5. **OpenAI Setup** (optional, for AI summaries)
   - Get API key from https://platform.openai.com
   - Add to .env file

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## Default Admin Account

After running sample_data.sql:
- **Email**: admin@cleankili.org
- **Password**: SuperAdmin123!

⚠️ **IMPORTANT**: Change this password in production!

## Verification

1. Health check: http://localhost:5000/api/health
2. Create test report via API
3. Login with admin credentials
4. Check admin dashboard endpoints

## Production Deployment

1. Set NODE_ENV=production
2. Use strong JWT_SECRET
3. Configure proper CORS_ORIGIN
4. Set up SSL/HTTPS
5. Configure monitoring and logging
