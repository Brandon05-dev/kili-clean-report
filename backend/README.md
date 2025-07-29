# CleanKili Python Backend

A secure Python backend for CleanKili's community reporting platform using FastAPI, Supabase, and messaging services.

## Features

- 📋 Accept community reports with GPS coordinates and photos
- 🔔 Instant WhatsApp & SMS alerts to admins
- 📊 Daily AI-generated summaries
- 🔐 Secure admin authentication with JWT
- 👨‍💼 Super Admin system for user management
- 📱 Email and phone verification

## Tech Stack

- **Framework**: FastAPI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with bcrypt
- **Messaging**: Twilio
- **AI**: OpenAI API
- **Scheduling**: APScheduler
- **Deployment**: Uvicorn

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables (copy `.env.example` to `.env`):
```bash
cp .env.example .env
```

3. Configure your `.env` file with:
- Supabase credentials
- Twilio credentials
- OpenAI API key
- JWT secret

4. Run the application:
```bash
uvicorn main:app --reload
```

## API Endpoints

### Public Endpoints
- `POST /api/reports` - Submit a new report
- `GET /api/health` - Health check

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/reports` - Get all reports
- `PUT /api/admin/reports/{id}` - Update report status

### Super Admin Endpoints
- `POST /api/super-admin/create` - Create super admin
- `POST /api/super-admin/invite` - Invite new admin
- `DELETE /api/super-admin/admin/{id}` - Remove admin

## Database Schema

```sql
-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    photo_url TEXT,
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_super_admin BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
