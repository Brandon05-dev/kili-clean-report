/**
 * Super Admin API Test Script
 * 
 * This script tests the Super Admin management endpoints
 * Run with: npm run test-super-admin
 */

import axios from 'axios';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

// Test configuration
const TEST_CONFIG = {
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Test data
const TEST_SUPER_ADMIN = {
  email: 'test-superadmin@cleankili.com',
  phoneNumber: '+1234567890',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'SuperAdmin'
};

let authToken: string = '';
let createdAdminId: string = '';

class SuperAdminTester {
  private axios;

  constructor() {
    this.axios = axios.create(TEST_CONFIG);
  }

  async authenticate(email: string, password: string): Promise<string> {
    try {
      console.log('🔐 Authenticating...');
      const response = await this.axios.post('/api/auth/login', {
        email,
        password
      });
      
      if (response.data.success && response.data.data.token) {
        console.log('✅ Authentication successful');
        return response.data.data.token;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      throw error;
    }
  }

  async testCreateSuperAdmin(): Promise<string> {
    try {
      console.log('\n📝 Testing Super Admin Creation...');
      
      const response = await this.axios.post('/api/super-admins', TEST_SUPER_ADMIN, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.data.success) {
        console.log('✅ Super Admin created successfully');
        console.log(`   ID: ${response.data.data.id}`);
        console.log(`   Email: ${response.data.data.email}`);
        console.log(`   Status: ${response.data.data.status}`);
        return response.data.data.id;
      } else {
        throw new Error('Failed to create Super Admin');
      }
    } catch (error: any) {
      console.error('❌ Super Admin creation failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testListSuperAdmins(): Promise<void> {
    try {
      console.log('\n📋 Testing Super Admin List...');
      
      const response = await this.axios.get('/api/super-admins', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.data.success) {
        console.log('✅ Super Admin list retrieved successfully');
        console.log(`   Total: ${response.data.meta.total}`);
        response.data.data.forEach((admin: any, index: number) => {
          console.log(`   ${index + 1}. ${admin.firstName} ${admin.lastName} (${admin.email}) - ${admin.status}`);
        });
      } else {
        throw new Error('Failed to get Super Admin list');
      }
    } catch (error: any) {
      console.error('❌ Super Admin list failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testUpdateSuperAdminStatus(adminId: string): Promise<void> {
    try {
      console.log('\n🔄 Testing Super Admin Status Update...');
      
      const response = await this.axios.put(`/api/super-admins/${adminId}/status`, {
        status: 'DEACTIVATED'
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.data.success) {
        console.log('✅ Super Admin status updated successfully');
        console.log(`   New Status: ${response.data.data.status}`);
        console.log(`   Active: ${response.data.data.isActive}`);
      } else {
        throw new Error('Failed to update Super Admin status');
      }
    } catch (error: any) {
      console.error('❌ Super Admin status update failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testDeleteSuperAdmin(adminId: string): Promise<void> {
    try {
      console.log('\n🗑️  Testing Super Admin Deletion...');
      
      const response = await this.axios.delete(`/api/super-admins/${adminId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.data.success) {
        console.log('✅ Super Admin deleted successfully');
        console.log(`   Deleted: ${response.data.data.deletedAdmin.firstName} ${response.data.data.deletedAdmin.lastName}`);
        console.log(`   Deleted by: ${response.data.data.deletedBy.email}`);
      } else {
        throw new Error('Failed to delete Super Admin');
      }
    } catch (error: any) {
      console.error('❌ Super Admin deletion failed:', error.response?.data || error.message);
      if (error.response?.status === 400 && error.response?.data?.error?.includes('last remaining')) {
        console.log('ℹ️  This is expected if you only have one Super Admin in the system');
      }
    }
  }

  async testSelfDeletionPrevention(): Promise<void> {
    try {
      console.log('\n🛡️  Testing Self-Deletion Prevention...');
      
      // This should fail
      const response = await this.axios.delete(`/api/super-admins/self`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      console.log('❌ Self-deletion should have been prevented!');
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.error?.includes('Cannot delete your own')) {
        console.log('✅ Self-deletion properly prevented');
      } else {
        console.error('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
  }

  async runAllTests(): Promise<void> {
    try {
      console.log('🚀 Starting Super Admin API Tests\n');
      console.log('======================================');

      // You need to provide valid Super Admin credentials here
      const EXISTING_SUPER_ADMIN_EMAIL = process.env.TEST_SUPER_ADMIN_EMAIL || 'existing-admin@cleankili.com';
      const EXISTING_SUPER_ADMIN_PASSWORD = process.env.TEST_SUPER_ADMIN_PASSWORD || 'password123';

      // Authenticate
      authToken = await this.authenticate(EXISTING_SUPER_ADMIN_EMAIL, EXISTING_SUPER_ADMIN_PASSWORD);

      // Test Super Admin creation
      createdAdminId = await this.testCreateSuperAdmin();

      // Test listing Super Admins
      await this.testListSuperAdmins();

      // Test status update
      await this.testUpdateSuperAdminStatus(createdAdminId);

      // Test self-deletion prevention
      await this.testSelfDeletionPrevention();

      // Test deletion (should work since we created a test admin)
      await this.testDeleteSuperAdmin(createdAdminId);

      console.log('\n✅ All Super Admin API tests completed successfully!');
      console.log('======================================');

    } catch (error) {
      console.error('\n❌ Test suite failed:', error);
      process.exit(1);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new SuperAdminTester();
  tester.runAllTests().catch(console.error);
}

export default SuperAdminTester;
