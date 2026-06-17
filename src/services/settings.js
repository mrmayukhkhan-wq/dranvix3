import { supabase } from '../lib/supabase'
import { TABLES } from '../lib/supabase.types'

const T = TABLES.SETTINGS

/**
 * Default settings shape — used as fallback if no row exists yet.
 */
export const DEFAULT_SETTINGS = {
  pharmacy_name:    '',
  theme:            'dark',
  currency:         'INR',
  alert_days_red:   90,
  alert_days_amber: 180,
}

/**
 * Fetch settings for the authenticated user.
 * Returns DEFAULT_SETTINGS if no row exists.
 */
export async function getSettings() {
  const { data, error } = await supabase
    .from(T)
    .select('*')
    .maybeSingle() // returns null instead of error when no row found

  if (error) throw error
  return data ?? DEFAULT_SETTINGS
}

/**
 * Save (upsert) settings for the authenticated user.
 * The DB has a UNIQUE constraint on user_id so upsert is safe.
 *
 * @param {object} payload — partial or full settings object
 */
export async function saveSettings(payload) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from(T)
    .upsert(
      {
        ...payload,
        user_id:    user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}
