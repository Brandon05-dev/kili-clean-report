/**
 * 🔐 Super Admin Seeder Script
 * 
 * This script creates the initial Super Admin user for CleanKili.
 * Run this ONCE during initial setup to create the first Super Admin.
 * 
 * Usage: npm run seed-super-admin
 */

import bcrypt from 'bcrypt';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { AdminUser } from '../types/admin';
import { firebaseConfig } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const createSuperAdmin = async () => {
  try {
    console.log('🔐 Creating Super Admin account...');

    // Super Admin details - UPDATE THESE!
    const superAdminData = {
      name: 'CleanKili Super Admin',
      email: 'superadmin@cleankili.org', // ⚠️ CHANGE THIS!
      phone: '+254700000000', // ⚠️ CHANGE THIS!
      password: 'SuperAdmin123!@#' // ⚠️ CHANGE THIS!
    };

    // Validate input
    if (!superAdminData.email.includes('@') || superAdminData.password.length < 8) {
      throw new Error('Invalid email or password (password must be at least 8 characters)');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(superAdminData.password, 12);

    // Create Super Admin user
    const superAdmin: AdminUser = {
      id: uuidv4(),
      name: superAdminData.name,
      email: superAdminData.email,
      phone: superAdminData.phone,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      passwordHash,
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date(),
      passwordSetAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      invitedAt: new Date()
    };

    // Save to database (using email as document ID for easy lookup)
    await setDoc(doc(db, 'admins', superAdmin.email), superAdmin);

    console.log('✅ Super Admin created successfully!');
    console.log('📧 Email:', superAdminData.email);
    console.log('🔑 Password:', superAdminData.password);
    console.log('🌐 Login URL: http://localhost:5173/super-admin-login');
    console.log('');
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('   1. Change the default password immediately after first login');
    console.log('   2. Use a strong, unique password');
    console.log('   3. Enable 2FA if available');
    console.log('   4. Delete this script after setup');
    console.log('   5. Do not share these credentials');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   1. Visit: http://localhost:5173/super-admin-login');
    console.log('   2. Login with the credentials above');
    console.log('   3. Change your password');
    console.log('   4. Start inviting other admins');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating Super Admin:', error);
    process.exit(1);
  }
};

// Confirmation prompt
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 CleanKili Super Admin Setup');
console.log('===============================');
console.log('');
console.log('⚠️  WARNING: This will create a Super Admin account with full system access.');
console.log('');
console.log('📧 Email: superadmin@cleankili.org');
console.log('📱 Phone: +254700000000');
console.log('🔑 Password: SuperAdmin123!@#');
console.log('');
console.log('❗ PLEASE REVIEW the credentials in this script and change them before running!');
console.log('');

rl.question('Are you sure you want to create this Super Admin account? (yes/no): ', (answer: string) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    rl.close();
    createSuperAdmin();
  } else {
    console.log('Setup cancelled. Please update the credentials in this script first.');
    rl.close();
    process.exit(0);
  }
});

export {};
