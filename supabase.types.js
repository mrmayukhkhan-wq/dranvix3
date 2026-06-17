/**
 * Supabase table names used across the app.
 * Change here if you ever rename a table — nowhere else.
 */
export const TABLES = {
  MEDICINES: 'medicines',
  ACTIVITY:  'activity',
  INVOICES:  'invoices',
  SETTINGS:  'settings',
}

/**
 * Medicine expiry zone thresholds (in days).
 * Mirrors the Red / Amber / Green logic in the UI.
 */
export const EXPIRY_ZONES = {
  RED:   90,   // 0–90 days  → critical
  AMBER: 180,  // 91–180 days → monitor
  // > 180 days → safe (green)
}

/**
 * Column shape reference (not enforced at runtime — for readability).
 *
 * medicines:
 *   id uuid PK, user_id uuid FK, name text, generic_name text,
 *   batch_no text, expiry_date date, quantity int, unit text,
 *   mrp numeric, category text, supplier text,
 *   created_at timestamptz, updated_at timestamptz
 *
 * activity:
 *   id uuid PK, user_id uuid FK, type text, description text,
 *   medicine_id uuid nullable FK → medicines.id,
 *   meta jsonb, created_at timestamptz
 *
 * invoices:
 *   id uuid PK, user_id uuid FK, distributor text,
 *   invoice_no text, invoice_date date, raw_text text,
 *   parsed_items jsonb, status text, created_at timestamptz
 *
 * settings:
 *   id uuid PK, user_id uuid UNIQUE FK,
 *   pharmacy_name text, theme text, currency text,
 *   alert_days_red int, alert_days_amber int,
 *   updated_at timestamptz
 */
