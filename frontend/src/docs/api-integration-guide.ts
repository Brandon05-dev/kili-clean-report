/**
 * CleanKili API Routes - Backend Integration Guide
 * 
 * This file outlines the API structure for connecting CleanKili
 * to a real backend (Express.js, Next.js API routes, etc.)
 */

// Example Express.js routes structure

/*
// reports.js - Express Router

const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/reports - Fetch all reports
router.get('/', async (req, res) => {
  try {
    const { status, search, dateRange } = req.query;
    
    // Query database with filters
    const reports = await Report.find({
      ...(status && status !== 'all' && { status }),
      ...(search && {
        $or: [
          { description: { $regex: search, $options: 'i' } },
          { 'location.address': { $regex: search, $options: 'i' } },
          { type: { $regex: search, $options: 'i' } }
        ]
      }),
      ...(dateRange && dateRange !== 'all' && {
        timestamp: { $gte: getDateRangeFilter(dateRange) }
      })
    }).sort({ timestamp: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reports - Create new report
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { type, description, location } = req.body;
    const photoFile = req.file;
    
    if (!photoFile) {
      return res.status(400).json({ error: 'Photo is required' });
    }
    
    // Upload photo to cloud storage (AWS S3, Firebase Storage, etc.)
    const photoURL = await uploadToCloudStorage(photoFile);
    
    // Create report in database
    const report = new Report({
      id: uuidv4(),
      type,
      description,
      location: JSON.parse(location),
      photoURL,
      timestamp: new Date().toISOString(),
      status: 'Pending'
    });
    
    await report.save();
    
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/reports/:id - Update report status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo } = req.body;
    
    // Verify admin authentication
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const report = await Report.findOneAndUpdate(
      { id },
      { 
        status, 
        notes, 
        assignedTo, 
        updatedAt: new Date().toISOString() 
      },
      { new: true }
    );
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/reports/:id - Delete report
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify admin authentication
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const report = await Report.findOneAndDelete({ id });
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reports/stats - Get report statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Report.countDocuments();
    const pending = await Report.countDocuments({ status: 'Pending' });
    const inProgress = await Report.countDocuments({ status: 'In Progress' });
    const resolved = await Report.countDocuments({ status: 'Resolved' });
    
    res.json({
      total,
      pending,
      inProgress,
      resolved,
      resolvedPercentage: total > 0 ? Math.round((resolved / total) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
*/

// Database Schema Examples:

/*
// MongoDB/Mongoose Schema
const reportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String
  },
  photoURL: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved'], 
    default: 'Pending' 
  },
  notes: String,
  assignedTo: String,
  timestamp: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// PostgreSQL Schema (using Sequelize)
const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  photoURL: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved'),
    defaultValue: 'Pending'
  },
  notes: DataTypes.TEXT,
  assignedTo: DataTypes.STRING
});
*/

// Cloud Storage Integration Examples:

/*
// Firebase Storage
const { storage } = require('./firebase-config');

const uploadToFirebase = async (file) => {
  const bucket = storage.bucket();
  const fileName = `reports/${Date.now()}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);
  
  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });
  
  return new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('finish', async () => {
      await fileUpload.makePublic();
      resolve(`https://storage.googleapis.com/${bucket.name}/${fileName}`);
    });
    stream.end(file.buffer);
  });
};

// AWS S3
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `reports/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };
  
  const result = await s3.upload(params).promise();
  return result.Location;
};
*/

export const API_ENDPOINTS = {
  REPORTS: '/api/reports',
  REPORTS_STATS: '/api/reports/stats',
  UPLOAD_PHOTO: '/api/upload/photo',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGOUT: '/api/auth/logout'
};

export const DATABASE_TABLES = {
  REPORTS: 'reports',
  USERS: 'users',
  ADMIN_ACTIONS: 'admin_actions'
};

export default {
  API_ENDPOINTS,
  DATABASE_TABLES
};
