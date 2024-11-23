import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * supabase client for interacting with Supabase 
 * make sure you have .env file with your supabaseURL and supabaseAnonKey to be able to access the database
 * and successfully have different clients and keep their information accurate and secure
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)