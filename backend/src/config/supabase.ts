import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Client for general operations (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
});

// Admin client for service-level operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test database connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
};
