// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import {
  useChecklist,
  useChecklists,
  useAddChecklist,
  useUpdateChecklist,
  useDeleteChecklist
} from './hooks/useChecklist.js';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useChecklist,
  useChecklists,
  useAddChecklist,
  useUpdateChecklist,
  useDeleteChecklist
};