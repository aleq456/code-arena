// All authentication functions live here
// Login, signup, logout, and getting the current user

import { supabase } from './supabase'

// Sign up with email and password
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username } // Store username in the user's profile
    }
  })
  return { data, error }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get the currently logged in user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
