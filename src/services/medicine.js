import { supabase } from '../lib/supabase'
import { TABLES } from '../lib/supabase.types'

const T = TABLES.MEDICINES

/**
 * Fetch all medicines for the authenticated user.
 * RLS on the DB ensures user_id scoping — no client-side filter needed.
 *
 * @param {object} opts
 * @param {string} [opts.sortBy='expiry_date']
 * @param {'asc'|'desc'} [opts.order='asc']
 * @returns {Promise<object[]>}
 */
export async function getMedicines({ sortBy = 'expiry_date', order = 'asc' } = {}) {
  const { data, error } = await supabase
    .from(T)
    .select('*')
    .order(sortBy, { ascending: order === 'asc' })

  if (error) throw error
  return data
}

/**
 * Fetch a single medicine by id.
 */
export async function getMedicineById(id) {
  const { data, error } = await supabase
    .from(T)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Full-text search on name and generic_name.
 * Falls back to ilike if pg_trgm isn't enabled.
 */
export async function searchMedicines(query) {
  if (!query?.trim()) return getMedicines()

  const { data, error } = await supabase
    .from(T)
    .select('*')
    .or(`name.ilike.%${query}%,generic_name.ilike.%${query}%`)
    .order('expiry_date', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Create a new medicine record.
 * user_id is injected by the DB via DEFAULT auth.uid() — no need to pass it.
 *
 * @param {object} payload
 */
export async function createMedicine(payload) {
  const { data, error } = await supabase
    .from(T)
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update an existing medicine by id.
 *
 * @param {string} id
 * @param {object} payload
 */
export async function updateMedicine(id, payload) {
  const { data, error } = await supabase
    .from(T)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a medicine by id.
 */
export async function deleteMedicine(id) {
  const { error } = await supabase
    .from(T)
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Bulk insert medicines (used by invoice parser).
 *
 * @param {object[]} items
 */
export async function bulkCreateMedicines(items) {
  const { data, error } = await supabase
    .from(T)
    .insert(items)
    .select()

  if (error) throw error
  return data
}

/**
 * Fetch medicines expiring within `days` days from today.
 * Used by the expiry alert panel.
 */
export async function getExpiringMedicines(days = 90) {
  const future = new Date()
  future.setDate(future.getDate() + days)

  const { data, error } = await supabase
    .from(T)
    .select('*')
    .lte('expiry_date', future.toISOString().split('T')[0])
    .gte('expiry_date', new Date().toISOString().split('T')[0])
    .order('expiry_date', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Fetch medicines with quantity at or below `threshold`.
 * Used by the low-stock panel.
 */
export async function getLowStockMedicines(threshold = 10) {
  const { data, error } = await supabase
    .from(T)
    .select('*')
    .lte('quantity', threshold)
    .order('quantity', { ascending: true })

  if (error) throw error
  return data
}
