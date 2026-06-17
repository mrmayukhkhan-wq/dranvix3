// src/utils/expiryCheck.ts
export type MedicineStatus = 'SAFE' | 'WARNING' | 'DANGER' | 'EXPIRED';

const DANGER_MAX_DAYS  = 90;   // 0–3 months → RED
const WARNING_MAX_DAYS = 180;  // 3–6 months → AMBER
// >180 days → GREEN

export const getExpiryStatus = (expiryDateString: string): MedicineStatus => {
  const days = getDaysRemaining(expiryDateString);
  if (days < 0)                    return 'EXPIRED';
  if (days <= DANGER_MAX_DAYS)     return 'DANGER';
  if (days <= WARNING_MAX_DAYS)    return 'WARNING';
  return 'SAFE';
};

export const getDaysRemaining = (expiryDateString: string): number => {
  const today  = new Date();
  const expiry = new Date(expiryDateString);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

/** Maps DANGER/WARNING/SAFE/EXPIRED → zone strings used by the UI */
export const statusToZone = (status: MedicineStatus): 'red' | 'amber' | 'green' => {
  if (status === 'EXPIRED' || status === 'DANGER') return 'red';
  if (status === 'WARNING') return 'amber';
  return 'green';
};
