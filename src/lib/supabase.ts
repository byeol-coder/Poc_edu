import { createClient } from '@supabase/supabase-js'

export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  'https://fwcriutfmorbukfmxfwr.supabase.co'

const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl && publishableKey && !publishableKey.includes('your_key_here'),
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, publishableKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'x-application-name': 'dot-lens-ufit-poc',
        },
      },
    })
  : null
