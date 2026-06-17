import { supabase } from '../lib/supabase'
import { TABLES } from '../lib/supabase.types'

const T = TABLES.ACTIVITY

/**
 * Activity types — keep in sync with DB check constraint if you add one.
 */
export const ACTIVITY_TYPES = {
  MEDICINE_ADDED:    'medicine_added',
  MEDICINE_UPDATED:  'medicine_updated',
  MEDICINE_DELETED:  'medicine_deleted',
  INVOICE_IMPORTED:  'invoice_imported',
  STOCK_ADJUSTED:    'stock_adjusted',
  SETTINGS_UPDATED:  'settings_updated',
}

/**
 * Fetch recent activity for the authenticated user.
 *
 * @param {number} limit — max records to return (default 50)
 */
export async function getActivity(limit = 50) {
  const { data, error } = await supabase
    .from(T)
    .select(`
      *,
      medicines ( name, batch_no )
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Log an activity event.
 *
 * @param {object} params
 * @param {string} params.type        — one of ACTIVITY_TYPES
 * @param {string} params.description — human-readable summary
 * @param {string} [params.medicine_id]
 * @param {object} [params.meta]      — arbitrary extra JSON
 */
export async function logActivity({ type, description, medicine_id = null, meta = {} }) {
  const { data, error } = await supabase
    .from(T)
    .insert({ type, description, medicine_id, meta })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete all activity logs for the authenticated user.
 * Used in settings → "Clear activity log".
 */
export async function clearActivity() {
  const { error } = await supabase
    .from(T)
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // delete all rows (RLS scopes to user)

  if (error) throw error
}
