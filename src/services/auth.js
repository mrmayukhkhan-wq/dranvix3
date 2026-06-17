import { supabase } from '../lib/supabase'

/**
 * Register a new user.
 * Supabase sends a confirmation email by default — disable in
 * Dashboard → Auth → Email if you want instant access during dev.
 */
export async function register({ email, password, pharmacyName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { pharmacy_name: pharmacyName }, // stored in auth.users.raw_user_meta_data
    },
  })

  if (error) throw error

  // Seed a settings row for this user so the settings service never 404s.
  // We do this here rather than a DB trigger so the app stays self-contained.
  if (data.user) {
    await supabase
      .from('settings')
      .upsert(
        {
          user_id:        data.user.id,
          pharmacy_name:  pharmacyName ?? '',
          theme:          'dark',
          currency:       'INR',
          alert_days_red:   90,
          alert_days_amber: 180,
        },
        { onConflict: 'user_id' }
      )
  }

  return data
}

/**
 * Sign in with email + password.
 */
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * Sign out the current user.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Returns the active session or null.
 * Use this on app init — do NOT use as a reactive source (use
 * onAuthStateChange in AppContext for that).
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

/**
 * Returns the current user object or null.
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

/**
 * Send a password reset email.
 */
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

/**
 * Update password (call after user follows reset link).
 */
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}
