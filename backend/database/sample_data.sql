-- Sample data for CleanKili database
-- Run this after schema.sql

-- Insert sample super admin (you should change the password hash)
-- Password: "SuperAdmin123!" (hashed with bcrypt)
INSERT INTO admins (
  id, 
  email, 
  phone, 
  firstName, 
  lastName, 
  passwordHash, 
  role, 
  isActive, 
  isVerified
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@cleankili.org',
  '+254700000000',
  'Super',
  'Admin',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeXbCQFT8.KQRT8Nu', -- SuperAdmin123!
  'Super Admin',
  true,
  true
);

-- Insert sample reports
INSERT INTO reports (
  description,
  photoUrl,
  lat,
  lng,
  status,
  category,
  priority,
  address,
  reporterEmail,
  reporterPhone
) VALUES 
(
  'Large pile of garbage dumped near the main road causing bad odor and attracting flies. This needs immediate attention as it''s affecting nearby residents.',
  'https://example.com/photo1.jpg',
  -1.2921,
  36.8219,
  'Pending',
  'Illegal Dumping',
  'High',
  'Nairobi CBD, Kenya',
  'citizen@example.com',
  '+254700000001'
),
(
  'Sewage overflow from broken pipe affecting the local community. Water is contaminated and poses health risks to children playing nearby.',
  'https://example.com/photo2.jpg',
  -1.2864,
  36.8172,
  'In Progress',
  'Sewage Issues',
  'Critical',
  'Kibera, Nairobi',
  'resident@example.com',
  '+254700000002'
),
(
  'Road completely damaged with deep potholes making it impassable for vehicles. Emergency repairs needed before rainy season.',
  'https://example.com/photo3.jpg',
  -1.3031,
  36.8456,
  'Resolved',
  'Road Damage',
  'Medium',
  'Westlands, Nairobi',
  'driver@example.com',
  '+254700000003'
),
(
  'Industrial factory releasing black smoke continuously, affecting air quality in the neighborhood. Residents reporting breathing difficulties.',
  'https://example.com/photo4.jpg',
  -1.2744,
  36.8077,
  'Pending',
  'Air Pollution',
  'High',
  'Industrial Area, Nairobi',
  'concerned@example.com',
  '+254700000004'
),
(
  'Plastic waste and bottles scattered along the river bank. Affecting water quality and wildlife in the area.',
  null,
  -1.3079,
  36.8308,
  'Pending',
  'Water Pollution',
  'Medium',
  'Karura Forest, Nairobi',
  'environmentalist@example.com',
  '+254700000005'
),
(
  'Construction noise starting at 5 AM daily, violating noise regulations and disturbing residents'' sleep.',
  null,
  -1.2630,
  36.8163,
  'In Progress',
  'Noise Pollution',
  'Low',
  'Karen, Nairobi',
  'neighbor@example.com',
  '+254700000006'
),
(
  'Overflowing dumpster that hasn''t been collected for weeks. Attracting rodents and creating unsanitary conditions.',
  'https://example.com/photo7.jpg',
  -1.2885,
  36.8317,
  'Resolved',
  'Waste Management',
  'Medium',
  'Parklands, Nairobi',
  'tenant@example.com',
  '+254700000007'
),
(
  'Chemical spill from unknown source creating foul smell and potential health hazard. Needs immediate investigation.',
  'https://example.com/photo8.jpg',
  -1.3206,
  36.8511,
  'Pending',
  'Other',
  'Critical',
  'Ruaraka, Nairobi',
  'whistleblower@example.com',
  '+254700000008'
);

-- Insert sample daily summary
INSERT INTO daily_summaries (
  date,
  total_reports,
  pending_reports,
  in_progress_reports,
  resolved_reports,
  rejected_reports,
  top_locations,
  top_categories,
  critical_reports_count,
  ai_summary
) VALUES (
  CURRENT_DATE - INTERVAL '1 day',
  8,
  4,
  2,
  2,
  0,
  '[
    {"area": "Nairobi CBD", "count": 2, "lat": -1.2921, "lng": 36.8219},
    {"area": "Kibera", "count": 1, "lat": -1.2864, "lng": 36.8172},
    {"area": "Westlands", "count": 1, "lat": -1.3031, "lng": 36.8456}
  ]'::jsonb,
  '[
    {"category": "Illegal Dumping", "count": 1},
    {"category": "Sewage Issues", "count": 1},
    {"category": "Road Damage", "count": 1},
    {"category": "Air Pollution", "count": 1},
    {"category": "Water Pollution", "count": 1}
  ]'::jsonb,
  2,
  'Yesterday''s environmental report shows 8 total incidents with 4 pending issues requiring immediate attention. Critical alerts include sewage overflow in Kibera and chemical spill in Ruaraka. The Nairobi CBD area shows highest activity with illegal dumping being the primary concern. Resolution rate stands at 25% with 2 of 8 reports successfully addressed. Priority should be given to the 2 critical reports affecting public health and safety.'
);

-- Insert sample notification logs
INSERT INTO notification_logs (
  type,
  recipient,
  message,
  status,
  external_id,
  report_id
) VALUES 
(
  'sms',
  '+254700000000',
  '🚨 NEW ENVIRONMENTAL REPORT - ID: Large pile of garbage dumped near the main road...',
  'delivered',
  'SM1234567890',
  (SELECT id FROM reports WHERE description LIKE 'Large pile of garbage%' LIMIT 1)
),
(
  'whatsapp',
  '+254700000000',
  '🚨 NEW ENVIRONMENTAL REPORT - ID: Sewage overflow from broken pipe...',
  'delivered',
  'WA1234567890',
  (SELECT id FROM reports WHERE description LIKE 'Sewage overflow%' LIMIT 1)
),
(
  'sms',
  '+254700000000',
  '📊 DAILY CLEANKILI SUMMARY - Yesterday''s environmental report shows 8 total incidents...',
  'delivered',
  'SM0987654321',
  null
);

-- Update some reports to show assignment and admin notes
UPDATE reports 
SET 
  assignedTo = '00000000-0000-0000-0000-000000000001',
  adminNotes = 'Contacted local waste management team. Scheduled for cleanup tomorrow morning.',
  updatedBy = '00000000-0000-0000-0000-000000000001'
WHERE description LIKE 'Large pile of garbage%';

UPDATE reports 
SET 
  assignedTo = '00000000-0000-0000-0000-000000000001',
  adminNotes = 'Emergency repair team dispatched. Water supply temporarily diverted.',
  updatedBy = '00000000-0000-0000-0000-000000000001'
WHERE description LIKE 'Sewage overflow%';

UPDATE reports 
SET 
  assignedTo = '00000000-0000-0000-0000-000000000001',
  adminNotes = 'Road repairs completed successfully. Quality inspection passed.',
  updatedBy = '00000000-0000-0000-0000-000000000001'
WHERE description LIKE 'Road completely damaged%';
