export const mockDashboard = {
  medicines: [
    { id: '1', name: 'Azithral 500',   barcode: 'AZT-7K42', batchNo: 'AZT-7K42',  supplier: 'Cipla',      quantity: 46,  expiryDate: '2026-06-25', sellPrice: 85,  zone: 'red'   },
    { id: '2', name: 'Pantocid DSR',   barcode: 'PND-229A', batchNo: 'PND-229A',  supplier: 'Sun Pharma', quantity: 81,  expiryDate: '2026-07-11', sellPrice: 42,  zone: 'red'   },
    { id: '3', name: 'Dolo 650',       barcode: 'DLO-81Q',  batchNo: 'DLO-81Q',   supplier: 'Micro Labs', quantity: 320, expiryDate: '2026-11-01', sellPrice: 30,  zone: 'amber' },
    { id: '4', name: 'Allegra 120',    barcode: 'ALG-44M',  batchNo: 'ALG-44M',   supplier: 'Sanofi',     quantity: 58,  expiryDate: '2026-08-19', sellPrice: 120, zone: 'amber' },
    { id: '5', name: 'ORS Lemon',      barcode: 'ORS-19T',  batchNo: 'ORS-19T',   supplier: 'FDC',        quantity: 190, expiryDate: '2026-12-14', sellPrice: 12,  zone: 'green' },
    { id: '6', name: 'Montair LC',     barcode: 'MLC-5P9',  batchNo: 'MLC-5P9',   supplier: 'Cipla',      quantity: 24,  expiryDate: '2026-06-22', sellPrice: 95,  zone: 'red'   },
  ],
  predictions: [
    { id: '1', name: 'Cetirizine',  reason: 'monsoon allergy onset',     delta: '+18%' },
    { id: '2', name: 'ORS sachets', reason: 'summer gastro pattern',     delta: '+24%' },
    { id: '3', name: 'Antacid gel', reason: 'festival dietary shift',    delta: '+11%' },
  ],
  activity: [
    { id: '1', mark: 'R', title: 'Return list drafted',   note: '6 red batches grouped by supplier', time: 'now' },
    { id: '2', mark: 'P', title: 'Invoice parsed',        note: '42 rows matched with 3 review flags', time: 'now' },
    { id: '3', mark: 'A', title: 'Demand buffer added',   note: 'Cetirizine reorder raised by 18%', time: 'now' },
  ],
  settings: {
    brand: '#22c55e',
    danger: '#ef4444',
    warn: '#f59e0b',
    safe: '#22c55e',
    density: 46,
  },
};

export const mockUser = {
  id: 'usr_1',
  name: 'Admin',
  pharmacyName: 'Greenline Medicals',
  city: 'Pune',
  profile: 'Retail pharmacy',
};
