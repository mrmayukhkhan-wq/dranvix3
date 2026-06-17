// src/types/index.ts

export type MedicineStatus = 'SAFE' | 'WARNING' | 'DANGER' | 'EXPIRED';
export type Zone = 'red' | 'amber' | 'green';

export interface Medicine {
  id: string;
  name: string;
  barcode: string;
  batchNo: string;
  supplier?: string;
  quantity: number;
  expiryDate: string;   // ISO date string: "2026-07-01"
  sellPrice: number;
  zone?: Zone;          // Computed from expiryDate at runtime
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  action: string;
  type: 'danger' | 'warning' | 'success';
}

export interface Prediction {
  id: string;
  name: string;
  reason: string;
  delta: string;
}

export interface ActivityItem {
  id: string;
  mark: string;
  title: string;
  note: string;
  time: string;
}

export interface AppSettings {
  brand: string;
  danger: string;
  warn: string;
  safe: string;
  density: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  pharmacyName?: string;
  city?: string;
  profile?: string;
  createdAt: string;
}
