import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const useMock =
  !SUPABASE_URL ||
  SUPABASE_URL === 'your-supabase-url' ||
  !SUPABASE_KEY ||
  SUPABASE_KEY === 'your-supabase-anon-key'

export const supabase = useMock ? null : createClient(SUPABASE_URL, SUPABASE_KEY)
