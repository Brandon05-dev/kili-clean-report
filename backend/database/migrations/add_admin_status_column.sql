-- Migration to add status column to admins table
-- Run this SQL in your Supabase SQL Editor if you have an existing database

-- Add status column to admins table
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACTIVE' 
CHECK (status IN ('INVITED', 'ACTIVE', 'DEACTIVATED'));

-- Update existing records to have ACTIVE status
UPDATE admins 
SET status = 'ACTIVE' 
WHERE status IS NULL OR status = '';

-- Create an index on the status column for better performance
CREATE INDEX IF NOT EXISTS idx_admins_status ON admins(status);

-- Log the migration
INSERT INTO notification_logs (
  id,
  type,
  recipient,
  message,
  status,
  created_at
) VALUES (
  uuid_generate_v4(),
  'system',
  'migration',
  'Added status column to admins table with CHECK constraint',
  'sent',
  NOW()
);
