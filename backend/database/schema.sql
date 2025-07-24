-- CleanKili Supabase Database Schema
-- Run these commands in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE report_status AS ENUM ('Pending', 'In Progress', 'Resolved', 'Rejected');
CREATE TYPE report_priority AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE report_category AS ENUM (
  'Waste Management',
  'Water Pollution', 
  'Air Pollution',
  'Noise Pollution',
  'Illegal Dumping',
  'Sewage Issues',
  'Road Damage',
  'Other'
);
CREATE TYPE admin_role AS ENUM ('Super Admin', 'Admin', 'Moderator');

-- Create reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL CHECK (char_length(description) >= 10),
  photoUrl TEXT,
  lat DECIMAL(10, 8) NOT NULL CHECK (lat >= -90 AND lat <= 90),
  lng DECIMAL(11, 8) NOT NULL CHECK (lng >= -180 AND lng <= 180),
  status report_status NOT NULL DEFAULT 'Pending',
  category report_category DEFAULT 'Other',
  priority report_priority DEFAULT 'Medium',
  address TEXT,
  reporterEmail TEXT,
  reporterPhone TEXT,
  adminNotes TEXT,
  assignedTo UUID REFERENCES admins(id),
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ,
  updatedBy UUID REFERENCES admins(id)
);

-- Create admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT NOT NULL CHECK (phone ~ '^\+[1-9]\d{1,14}$'),
  firstName TEXT NOT NULL CHECK (char_length(firstName) >= 2),
  lastName TEXT NOT NULL CHECK (char_length(lastName) >= 2),
  passwordHash TEXT NOT NULL,
  role admin_role NOT NULL DEFAULT 'Admin',
  isActive BOOLEAN NOT NULL DEFAULT true,
  isVerified BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ,
  lastLogin TIMESTAMPTZ,
  invitedBy UUID REFERENCES admins(id)
);

-- Create admin_invitations table
CREATE TABLE admin_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT NOT NULL CHECK (phone ~ '^\+[1-9]\d{1,14}$'),
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  role admin_role NOT NULL,
  invitedBy UUID NOT NULL REFERENCES admins(id),
  invitationToken UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  expiresAt TIMESTAMPTZ NOT NULL,
  isUsed BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create daily_summaries table
CREATE TABLE daily_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  total_reports INTEGER NOT NULL DEFAULT 0,
  pending_reports INTEGER NOT NULL DEFAULT 0,
  in_progress_reports INTEGER NOT NULL DEFAULT 0,
  resolved_reports INTEGER NOT NULL DEFAULT 0,
  rejected_reports INTEGER NOT NULL DEFAULT 0,
  top_locations JSONB,
  top_categories JSONB,
  critical_reports_count INTEGER NOT NULL DEFAULT 0,
  ai_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create notification_logs table (for tracking SMS/WhatsApp delivery)
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('sms', 'whatsapp', 'email')),
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'delivered', 'read')),
  external_id TEXT, -- Twilio SID or other service ID
  error_message TEXT,
  report_id UUID REFERENCES reports(id),
  admin_id UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create verification_codes table (for phone verification)
CREATE TABLE verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(createdAt DESC);
CREATE INDEX idx_reports_priority ON reports(priority);
CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_reports_assigned_to ON reports(assignedTo);
CREATE INDEX idx_reports_location ON reports(lat, lng);

CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_role ON admins(role);
CREATE INDEX idx_admins_active ON admins(isActive);

CREATE INDEX idx_admin_invitations_token ON admin_invitations(invitationToken);
CREATE INDEX idx_admin_invitations_email ON admin_invitations(email);
CREATE INDEX idx_admin_invitations_expires ON admin_invitations(expiresAt);

CREATE INDEX idx_daily_summaries_date ON daily_summaries(date DESC);

CREATE INDEX idx_notification_logs_created_at ON notification_logs(created_at DESC);
CREATE INDEX idx_notification_logs_type ON notification_logs(type);
CREATE INDEX idx_notification_logs_report_id ON notification_logs(report_id);

CREATE INDEX idx_verification_codes_phone ON verification_codes(phone);
CREATE INDEX idx_verification_codes_expires ON verification_codes(expires_at);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reports_updated_at 
    BEFORE UPDATE ON reports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at 
    BEFORE UPDATE ON admins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Public read access to reports (limited fields)
CREATE POLICY "Public can view reports" ON reports
FOR SELECT USING (true);

-- Only authenticated admins can modify reports
CREATE POLICY "Admins can modify reports" ON reports
FOR ALL USING (auth.role() = 'service_role');

-- Only authenticated admins can access admin tables
CREATE POLICY "Service role access to admins" ON admins
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role access to admin_invitations" ON admin_invitations
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role access to daily_summaries" ON daily_summaries
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role access to notification_logs" ON notification_logs
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role access to verification_codes" ON verification_codes
FOR ALL USING (auth.role() = 'service_role');
