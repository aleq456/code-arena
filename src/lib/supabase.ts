// This file creates our connection to Supabase
// We use it everywhere we need to talk to the database or handle auth

import { createClient } from '@supabase/supabase-js'

// These come from your .env.local file - never hardcode these!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create and export the Supabase client
// We'll import this in any file that needs database access
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
