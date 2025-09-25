
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifuiowfckpirkjquxjwf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdWlvd2Zja3BpcmtqcXV4andmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NDE1MzIsImV4cCI6MjA3NDMxNzUzMn0.zU_IPQwfGnq1csy51phpjhO_vBOKqp0zMx_NxGwpIP8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
