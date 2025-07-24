/**
 * Create First Super Admin Script
 * 
 * This script helps you create the first Super Admin in your system.
 * Run this once to bootstrap your admin system.
 * 
 * Usage: tsx scripts/createFirstSuperAdmin.ts
 */

import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../src/config/supabase';
import { v4 as uuidv4 } from 'uuid';

interface CreateFirstSuperAdminInput {
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
}

class FirstSuperAdminCreator {
  async createFirstSuperAdmin(input: CreateFirstSuperAdminInput): Promise<void> {
    try {
      console.log('🚀 Creating first Super Admin...');

      // Check if any Super Admins already exist
      const { count, error: countError } = await supabaseAdmin
        .from('admins')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'Super Admin');

      if (countError) {
        throw new Error(`Database error: ${countError.message}`);
      }

      if (count && count > 0) {
        console.log('⚠️  Super Admins already exist in the system. Aborting.');
        return;
      }

      // Validate email format
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(input.email)) {
        throw new Error('Invalid email format');
      }

      // Validate phone format
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(input.phoneNumber)) {
        throw new Error('Invalid phone format. Use international format like +1234567890');
      }

      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
      if (input.password.length < 8 || !passwordRegex.test(input.password)) {
        throw new Error('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character');
      }

      // Hash password
      console.log('🔐 Hashing password...');
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(input.password, saltRounds);

      // Create Super Admin
      const newSuperAdmin = {
        id: uuidv4(),
        email: input.email.toLowerCase(),
        phone: input.phoneNumber,
        firstName: input.firstName,
        lastName: input.lastName,
        passwordHash,
        role: 'Super Admin' as const,
        status: 'ACTIVE',
        isActive: true,
        isVerified: true, // First admin is auto-verified
        createdAt: new Date().toISOString()
      };

      const { data: createdAdmin, error: createError } = await supabaseAdmin
        .from('admins')
        .insert(newSuperAdmin)
        .select(`
          id,
          email,
          phone,
          firstName,
          lastName,
          role,
          status,
          isActive,
          isVerified,
          createdAt
        `)
        .single();

      if (createError) {
        throw new Error(`Failed to create Super Admin: ${createError.message}`);
      }

      console.log('✅ First Super Admin created successfully!');
      console.log('');
      console.log('Super Admin Details:');
      console.log(`  ID: ${createdAdmin.id}`);
      console.log(`  Email: ${createdAdmin.email}`);
      console.log(`  Phone: ${createdAdmin.phone}`);
      console.log(`  Name: ${createdAdmin.firstName} ${createdAdmin.lastName}`);
      console.log(`  Role: ${createdAdmin.role}`);
      console.log(`  Status: ${createdAdmin.status}`);
      console.log(`  Created: ${createdAdmin.createdAt}`);
      console.log('');
      console.log('🔑 Please save these credentials securely!');
      console.log('📧 You can now log in to the admin dashboard with this email and password.');

    } catch (error) {
      console.error('❌ Error creating first Super Admin:', error);
      throw error;
    }
  }
}

// Default Super Admin data (CHANGE THESE VALUES!)
const DEFAULT_SUPER_ADMIN: CreateFirstSuperAdminInput = {
  email: process.env.FIRST_SUPER_ADMIN_EMAIL || 'admin@cleankili.com',
  phoneNumber: process.env.FIRST_SUPER_ADMIN_PHONE || '+1234567890',
  password: process.env.FIRST_SUPER_ADMIN_PASSWORD || 'ChangeMe123!',
  firstName: process.env.FIRST_SUPER_ADMIN_FIRST_NAME || 'Super',
  lastName: process.env.FIRST_SUPER_ADMIN_LAST_NAME || 'Admin'
};

// Run script if executed directly
if (require.main === module) {
  const creator = new FirstSuperAdminCreator();
  
  console.log('🔧 CleanKili First Super Admin Creator');
  console.log('=====================================');
  console.log('');
  console.log('This will create the first Super Admin in your system.');
  console.log('Make sure to update the credentials in your environment variables or this script.');
  console.log('');

  creator.createFirstSuperAdmin(DEFAULT_SUPER_ADMIN)
    .then(() => {
      console.log('🎉 Setup complete! You can now start managing your CleanKili platform.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error.message);
      process.exit(1);
    });
}

export default FirstSuperAdminCreator;
