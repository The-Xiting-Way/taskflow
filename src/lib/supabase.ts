import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

// Use the hardcoded values directly since environment variables are not working
const SUPABASE_URL = import.meta.env.SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_KEY

// Create the Supabase client with the correct configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Types for our database tables
export type User = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignee_id: string | null;
  creator_id: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  task_id: string;
  type: 'TASK_ASSIGNED' | 'STATUS_CHANGED';
  message: string;
  read: boolean;
  created_at: string;
}; 