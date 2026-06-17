import { supabase } from '../lib/supabase'
import { TABLES } from '../lib/supabase.types'
import { bulkCreateMedicines } from './medicine'
import { logActivity, ACTIVITY_TYPES } from './activity'

const T = TABLES.INVOICES

export const INVOICE_STATUS = {
  PENDING:   'pending',
  PARSED:    'parsed',
  IMPORTED:  'imported',
  FAILED:    'failed',
}

/**
 * Fetch all invoices for the authenticated user.
 */
export async function getInvoices() {
  const { data, error } = await supabase
    .from(T)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Fetch a single invoice by id.
 */
export async function getInvoiceById(id) {
  const { data, error } = await supabase
    .from(T)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Create a raw invoice record (before parsing).
 *
 * @param {object} payload
 * @param {string} payload.distributor
 * @param {string} [payload.invoice_no]
 * @param {string} [payload.invoice_date]  — ISO date string
 * @param {string} [payload.raw_text]      — OCR / pasted text
 */
export async function createInvoice(payload) {
  const { data, error } = await supabase
    .from(T)
    .insert({ ...payload, status: INVOICE_STATUS.PENDING })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update an invoice with parsed data from the Claude Vision parser.
 *
 * @param {string}   id
 * @param {object[]} parsedItems   — array of medicine-shaped objects
 * @param {string}   [status]
 */
export async function updateInvoiceParsed(id, parsedItems, status = INVOICE_STATUS.PARSED) {
  const { data, error } = await supabase
    .from(T)
    .update({ parsed_items: parsedItems, status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Import parsed invoice items into the medicines table.
 * Marks the invoice as imported and logs the activity.
 *
 * @param {string}   invoiceId
 * @param {object[]} items       — medicine rows ready for insert
 */
export async function importInvoiceToStock(invoiceId, items) {
  // 1. Bulk-insert medicines
  const created = await bulkCreateMedicines(items)

  // 2. Mark invoice imported
  const { data: invoice, error } = await supabase
    .from(T)
    .update({ status: INVOICE_STATUS.IMPORTED })
    .eq('id', invoiceId)
    .select()
    .single()

  if (error) throw error

  // 3. Log activity
  await logActivity({
    type:        ACTIVITY_TYPES.INVOICE_IMPORTED,
    description: `Imported ${created.length} medicine(s) from invoice ${invoice.invoice_no ?? invoiceId}`,
    meta:        { invoice_id: invoiceId, count: created.length },
  })

  return { invoice, medicines: created }
}

/**
 * Delete an invoice by id.
 */
export async function deleteInvoice(id) {
  const { error } = await supabase
    .from(T)
    .delete()
    .eq('id', id)

  if (error) throw error
}
