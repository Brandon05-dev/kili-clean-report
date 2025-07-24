# 📱 CleanKili WhatsApp Alert & Daily Summary System

## 🎯 Overview

This system provides **real-time WhatsApp alerts** and **daily AI-powered summaries** for environmental reports submitted through CleanKili. It ensures immediate response to urgent issues while providing comprehensive daily insights for accountability and trend analysis.

## ✨ Key Features

### 🚨 Real-time WhatsApp Alerts
- **Instant notifications** when new reports are submitted
- Includes location, description, photo, GPS coordinates
- Sent to all configured admin phone numbers
- Delivery status tracking and error handling

### 📊 Daily Summary (11:59 PM)
- **Automated daily digest** of all reports
- **AI-powered insights** using OpenAI GPT-4
- Statistics: total, pending, resolved, critical reports
- Top issue types and hotspot locations
- Critical reports with direct action links

### 🤖 AI Intelligence
- **Natural language summaries** of daily trends
- **Pattern recognition** for recurring issues
- **Priority flagging** for urgent situations
- **Actionable recommendations** for admins

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Backend API    │───▶│   Firebase DB   │
│   (React)       │    │   (Express.js)   │    │   (Firestore)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  WhatsApp API    │
                       │  (Twilio)        │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  OpenAI GPT-4    │
                       │  (AI Insights)   │
                       └──────────────────┘
```

## 🚀 Quick Start

1. **Install dependencies**: `npm install`
2. **Copy environment**: `cp .env.example .env`
3. **Configure credentials**: Edit `.env` with your API keys
4. **Start server**: `npm run dev`

## 📅 Scheduled Tasks

- **Daily Summary**: 11:59 PM daily via cron job
- **Real-time Alerts**: Immediate on new reports
- **AI Analysis**: Integrated with daily summaries

## 🔧 API Endpoints

- `POST /api/reports` - Create report (triggers WhatsApp)
- `GET /api/reports` - List reports
- `POST /api/test-daily-summary` - Test summary
- `GET /health` - Health check

## 💰 Estimated Costs

- **WhatsApp**: ~$3-5/month
- **OpenAI**: ~$0.50/month
- **Firebase**: Free - $5/month

## Structure

```
backend/
├── src/
│   ├── services/          # Database and external service integrations
│   │   ├── database.ts    # Main database service
│   │   └── liveDatabase.ts # Live database operations
│   ├── types/             # TypeScript type definitions
│   │   └── report.ts      # Report-related types
│   └── index.ts           # Main server entry point (to be created)
├── package.json           # Backend dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Features

- Database services for report management
- Live data operations
- TypeScript support
- Express.js ready (to be implemented)

## Future Enhancements

- REST API endpoints
- Authentication middleware
- Database migrations
- API documentation
- Testing framework
