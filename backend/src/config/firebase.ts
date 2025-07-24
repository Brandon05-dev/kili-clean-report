// Firebase configuration
// Replace these values with your actual Firebase project credentials

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "cleankili-reports.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "cleankili-reports",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "cleankili-reports.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Firestore collections
export const COLLECTIONS = {
  REPORTS: 'reports',
  DAILY_SUMMARIES: 'daily_summaries',
  WHATSAPP_LOGS: 'whatsapp_logs',
  USERS: 'users'
};

// WhatsApp configuration
export const WHATSAPP_CONFIG = {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
  ADMIN_PHONE_NUMBERS: (process.env.ADMIN_PHONE_NUMBERS || '').split(',').map(num => num.trim())
};

// OpenAI configuration
export const OPENAI_CONFIG = {
  API_KEY: process.env.OPENAI_API_KEY,
  MODEL: process.env.OPENAI_MODEL || 'gpt-4',
  MAX_TOKENS: parseInt(process.env.OPENAI_MAX_TOKENS || '200')
};

// App configuration
export const APP_CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  TIMEZONE: process.env.TIMEZONE || 'Africa/Nairobi',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};
