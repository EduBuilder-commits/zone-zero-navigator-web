import { createClient } from '@supabase/supabase-js'

// Create Supabase client - handle missing env vars gracefully
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Auth will work in demo mode.')
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()
export const isConfigured = !!(supabase && process.env.NEXT_PUBLIC_SUPABASE_URL)

// Auth helpers
export async function signUp(email: string, password: string, fullName?: string) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })
  
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`
    }
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  if (!supabase) return
  
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  if (!supabase) return null
  
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}

export async function resetPassword(email: string) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`
  })
  
  if (error) throw error
  return data
}

// Listen to auth changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  if (!supabase) {
    // Return no-op if not configured
    return () => {}
  }
  return supabase.auth.onAuthStateChange(callback)
}
