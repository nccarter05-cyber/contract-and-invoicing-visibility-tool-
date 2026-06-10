import type { Client, Contract, ContractLineItem, Invoice } from '../types'

export const clients: Client[] = [
  { id: 'cli_001', name: 'Marlow & Co.', industry: 'Fashion / Retail', website: 'marlowandco.com', created_at: '2026-01-10T00:00:00Z' },
  { id: 'cli_002', name: 'Vantage Properties', industry: 'Real Estate', website: 'vantageproperties.com', created_at: '2025-08-15T00:00:00Z' },
  { id: 'cli_003', name: 'Blue Ridge Coffee', industry: 'Food & Beverage', website: 'blueridgecoffee.com', created_at: '2025-07-01T00:00:00Z' },
  { id: 'cli_004', name: 'Pinnacle Fitness', industry: 'Health & Wellness', website: 'pinnaclefitness.com', created_at: '2026-02-20T00:00:00Z' },
  { id: 'cli_005', name: 'Horizon Tech', industry: 'Technology', website: 'horizontech.io', created_at: '2026-03-05T00:00:00Z' },
]

export const contracts: Contract[] = [
  {
    id: 'con_001', client_id: 'cli_001', title: 'Brand Identity Suite',
    total_value: 45000, status: 'signed', start_date: '2026-01-15', end_date: '2026-06-15',
    payment_terms: '33% upfront / 33% midway / 34% on delivery',
    notes: 'Full brand identity including logo, guidelines, and collateral.',
    created_at: '2026-01-10T00:00:00Z', signed_at: '2026-01-14T00:00:00Z',
  },
  {
    id: 'con_002', client_id: 'cli_001', title: 'Social Media Retainer',
    total_value: 18000, status: 'signed', start_date: '2026-02-01', end_date: '2026-07-31',
    payment_terms: 'Monthly billing — $3,000/month',
    created_at: '2026-01-28T00:00:00Z', signed_at: '2026-01-30T00:00:00Z',
  },
  {
    id: 'con_003', client_id: 'cli_002', title: 'Website Redesign',
    total_value: 28000, status: 'completed', start_date: '2025-11-01', end_date: '2026-01-31',
    payment_terms: '50% upfront / 50% on launch',
    notes: 'Full redesign including UX research, visual design, and development.',
    created_at: '2025-10-25T00:00:00Z', signed_at: '2025-10-28T00:00:00Z',
  },
  {
    id: 'con_004', client_id: 'cli_002', title: 'Property Marketing Package',
    total_value: 9500, status: 'completed', start_date: '2025-09-01', end_date: '2025-11-30',
    payment_terms: '50% upfront / 50% on delivery',
    notes: 'Photography direction, print collateral, and digital ad creatives.',
    created_at: '2025-08-20T00:00:00Z', signed_at: '2025-08-25T00:00:00Z',
  },
  {
    id: 'con_005', client_id: 'cli_003', title: 'Brand Identity Package',
    total_value: 12000, status: 'completed', start_date: '2025-08-01', end_date: '2025-10-31',
    payment_terms: '50% upfront / 50% on delivery',
    created_at: '2025-07-20T00:00:00Z', signed_at: '2025-07-25T00:00:00Z',
  },
  {
    id: 'con_006', client_id: 'cli_003', title: 'Marketing Materials',
    total_value: 6500, status: 'completed', start_date: '2025-10-01', end_date: '2025-12-31',
    payment_terms: '50% upfront / 50% on delivery',
    notes: 'Menu, packaging, and in-store signage design.',
    created_at: '2025-09-25T00:00:00Z', signed_at: '2025-09-28T00:00:00Z',
  },
  {
    id: 'con_007', client_id: 'cli_004', title: 'Full Brand Overhaul',
    total_value: 38000, status: 'signed', start_date: '2026-03-01', end_date: '2026-08-31',
    payment_terms: '50% upfront / 25% at milestone / 25% on delivery',
    notes: 'Complete brand refresh: visual identity, website design, and marketing suite.',
    created_at: '2026-02-22T00:00:00Z', signed_at: '2026-02-28T00:00:00Z',
  },
  {
    id: 'con_008', client_id: 'cli_005', title: 'Corporate Video Series',
    total_value: 22000, status: 'sent', start_date: '2026-04-01', end_date: '2026-07-31',
    payment_terms: '50% upfront / 50% on delivery',
    notes: '5-video corporate series: pre-production through final delivery.',
    created_at: '2026-03-20T00:00:00Z',
  },
]

export const lineItems: ContractLineItem[] = [
  // con_001: Brand Identity Suite ($45,000)
  { id: 'li_001', contract_id: 'con_001', description: 'Discovery & Brand Strategy', quantity: 1, rate: 8000, amount: 8000 },
  { id: 'li_002', contract_id: 'con_001', description: 'Logo Design & Brand Mark', quantity: 1, rate: 12000, amount: 12000 },
  { id: 'li_003', contract_id: 'con_001', description: 'Brand Guidelines Document', quantity: 1, rate: 7000, amount: 7000 },
  { id: 'li_004', contract_id: 'con_001', description: 'Stationery & Collateral Design', quantity: 1, rate: 9000, amount: 9000 },
  { id: 'li_005', contract_id: 'con_001', description: 'Social Media Asset Kit', quantity: 1, rate: 5000, amount: 5000 },
  { id: 'li_006', contract_id: 'con_001', description: 'Final Deliverables Package', quantity: 1, rate: 4000, amount: 4000 },

  // con_002: Social Media Retainer ($18,000)
  { id: 'li_007', contract_id: 'con_002', description: 'Monthly Content Strategy', quantity: 6, rate: 2000, amount: 12000 },
  { id: 'li_008', contract_id: 'con_002', description: 'Custom Graphic Design Assets', quantity: 1, rate: 4000, amount: 4000 },
  { id: 'li_009', contract_id: 'con_002', description: 'Monthly Analytics Reporting', quantity: 6, rate: 333, amount: 2000 },

  // con_003: Website Redesign ($28,000)
  { id: 'li_010', contract_id: 'con_003', description: 'UX Research & Wireframing', quantity: 1, rate: 6000, amount: 6000 },
  { id: 'li_011', contract_id: 'con_003', description: 'Visual Design (Desktop + Mobile)', quantity: 1, rate: 8000, amount: 8000 },
  { id: 'li_012', contract_id: 'con_003', description: 'Frontend Development', quantity: 1, rate: 10000, amount: 10000 },
  { id: 'li_013', contract_id: 'con_003', description: 'QA Testing & Launch', quantity: 1, rate: 2000, amount: 2000 },
  { id: 'li_014', contract_id: 'con_003', description: 'Hosting Setup & Config', quantity: 1, rate: 2000, amount: 2000 },

  // con_004: Property Marketing ($9,500)
  { id: 'li_015', contract_id: 'con_004', description: 'Photography Direction', quantity: 1, rate: 2500, amount: 2500 },
  { id: 'li_016', contract_id: 'con_004', description: 'Print Collateral Design', quantity: 1, rate: 3500, amount: 3500 },
  { id: 'li_017', contract_id: 'con_004', description: 'Digital Ad Creatives', quantity: 1, rate: 2000, amount: 2000 },
  { id: 'li_018', contract_id: 'con_004', description: 'Campaign Setup', quantity: 1, rate: 1500, amount: 1500 },

  // con_005: Brand Identity ($12,000)
  { id: 'li_019', contract_id: 'con_005', description: 'Brand Discovery Workshop', quantity: 1, rate: 2000, amount: 2000 },
  { id: 'li_020', contract_id: 'con_005', description: 'Logo & Visual Identity System', quantity: 1, rate: 6000, amount: 6000 },
  { id: 'li_021', contract_id: 'con_005', description: 'Brand Style Guide', quantity: 1, rate: 2500, amount: 2500 },
  { id: 'li_022', contract_id: 'con_005', description: 'Final Files Package', quantity: 1, rate: 1500, amount: 1500 },

  // con_006: Marketing Materials ($6,500)
  { id: 'li_023', contract_id: 'con_006', description: 'Menu Design', quantity: 1, rate: 1800, amount: 1800 },
  { id: 'li_024', contract_id: 'con_006', description: 'Packaging Design', quantity: 1, rate: 2200, amount: 2200 },
  { id: 'li_025', contract_id: 'con_006', description: 'In-Store Signage', quantity: 1, rate: 2500, amount: 2500 },

  // con_007: Full Brand Overhaul ($38,000)
  { id: 'li_026', contract_id: 'con_007', description: 'Brand Audit & Strategy', quantity: 1, rate: 5000, amount: 5000 },
  { id: 'li_027', contract_id: 'con_007', description: 'Visual Identity System', quantity: 1, rate: 14000, amount: 14000 },
  { id: 'li_028', contract_id: 'con_007', description: 'Website Design', quantity: 1, rate: 10000, amount: 10000 },
  { id: 'li_029', contract_id: 'con_007', description: 'Marketing Collateral Suite', quantity: 1, rate: 6000, amount: 6000 },
  { id: 'li_030', contract_id: 'con_007', description: 'Brand Launch Kit', quantity: 1, rate: 3000, amount: 3000 },

  // con_008: Corporate Video Series ($22,000)
  { id: 'li_031', contract_id: 'con_008', description: 'Pre-Production & Scripting', quantity: 1, rate: 4000, amount: 4000 },
  { id: 'li_032', contract_id: 'con_008', description: '5-Video Production Days', quantity: 5, rate: 2400, amount: 12000 },
  { id: 'li_033', contract_id: 'con_008', description: 'Post-Production & Editing', quantity: 1, rate: 5000, amount: 5000 },
  { id: 'li_034', contract_id: 'con_008', description: 'Final Delivery & Asset Transfer', quantity: 1, rate: 1000, amount: 1000 },
]

export const invoices: Invoice[] = [
  // con_001: Brand Identity Suite ($45k) — 89% billed, 67% collected, 1 overdue
  { id: 'inv_001', contract_id: 'con_001', client_id: 'cli_001', invoice_number: 'INV-2026-001', amount: 15000, paid_amount: 15000, status: 'paid', due_date: '2026-01-20', paid_at: '2026-01-22T00:00:00Z', notes: 'Upfront deposit — 33%', created_at: '2026-01-15T00:00:00Z' },
  { id: 'inv_002', contract_id: 'con_001', client_id: 'cli_001', invoice_number: 'INV-2026-002', amount: 15000, paid_amount: 15000, status: 'paid', due_date: '2026-03-15', paid_at: '2026-03-18T00:00:00Z', notes: 'Midway milestone payment', created_at: '2026-03-01T00:00:00Z' },
  { id: 'inv_003', contract_id: 'con_001', client_id: 'cli_001', invoice_number: 'INV-2026-003', amount: 10000, paid_amount: 0, status: 'overdue', due_date: '2026-05-01', notes: 'Milestone 3 — brand guidelines delivery', created_at: '2026-04-15T00:00:00Z' },
  { id: 'inv_004', contract_id: 'con_001', client_id: 'cli_001', invoice_number: 'INV-2026-004', amount: 5000, paid_amount: 0, status: 'draft', due_date: '2026-06-15', notes: 'Final delivery payment', created_at: '2026-04-15T00:00:00Z' },

  // con_002: Social Media Retainer ($18k) — 83% billed, 70% collected, partial
  { id: 'inv_005', contract_id: 'con_002', client_id: 'cli_001', invoice_number: 'INV-2026-005', amount: 3000, paid_amount: 3000, status: 'paid', due_date: '2026-02-05', paid_at: '2026-02-06T00:00:00Z', notes: 'February retainer', created_at: '2026-02-01T00:00:00Z' },
  { id: 'inv_006', contract_id: 'con_002', client_id: 'cli_001', invoice_number: 'INV-2026-006', amount: 3000, paid_amount: 3000, status: 'paid', due_date: '2026-03-05', paid_at: '2026-03-07T00:00:00Z', notes: 'March retainer', created_at: '2026-03-01T00:00:00Z' },
  { id: 'inv_007', contract_id: 'con_002', client_id: 'cli_001', invoice_number: 'INV-2026-007', amount: 3000, paid_amount: 3000, status: 'paid', due_date: '2026-04-05', paid_at: '2026-04-06T00:00:00Z', notes: 'April retainer', created_at: '2026-04-01T00:00:00Z' },
  { id: 'inv_008', contract_id: 'con_002', client_id: 'cli_001', invoice_number: 'INV-2026-008', amount: 3000, paid_amount: 1500, status: 'partially_paid', due_date: '2026-05-05', notes: 'May retainer — partial payment received', created_at: '2026-05-01T00:00:00Z' },
  { id: 'inv_009', contract_id: 'con_002', client_id: 'cli_001', invoice_number: 'INV-2026-009', amount: 3000, paid_amount: 0, status: 'sent', due_date: '2026-06-05', notes: 'June retainer', created_at: '2026-06-01T00:00:00Z' },

  // con_003: Website Redesign ($28k) — 100% billed, 100% collected
  { id: 'inv_010', contract_id: 'con_003', client_id: 'cli_002', invoice_number: 'INV-2025-010', amount: 14000, paid_amount: 14000, status: 'paid', due_date: '2025-11-10', paid_at: '2025-11-12T00:00:00Z', notes: '50% upfront deposit', created_at: '2025-11-01T00:00:00Z' },
  { id: 'inv_011', contract_id: 'con_003', client_id: 'cli_002', invoice_number: 'INV-2026-011', amount: 14000, paid_amount: 14000, status: 'paid', due_date: '2026-01-20', paid_at: '2026-01-22T00:00:00Z', notes: 'Final payment on launch', created_at: '2026-01-15T00:00:00Z' },

  // con_004: Property Marketing ($9,500) — overbilled! ($9,750)
  { id: 'inv_012', contract_id: 'con_004', client_id: 'cli_002', invoice_number: 'INV-2025-012', amount: 4750, paid_amount: 4750, status: 'paid', due_date: '2025-09-10', paid_at: '2025-09-11T00:00:00Z', notes: '50% upfront deposit', created_at: '2025-09-01T00:00:00Z' },
  { id: 'inv_013', contract_id: 'con_004', client_id: 'cli_002', invoice_number: 'INV-2025-013', amount: 5000, paid_amount: 5000, status: 'paid', due_date: '2025-11-05', paid_at: '2025-11-06T00:00:00Z', notes: 'Final payment — scope adjustment included', created_at: '2025-11-01T00:00:00Z' },

  // con_005: Brand Identity ($12k) — 100%
  { id: 'inv_014', contract_id: 'con_005', client_id: 'cli_003', invoice_number: 'INV-2025-014', amount: 6000, paid_amount: 6000, status: 'paid', due_date: '2025-08-05', paid_at: '2025-08-07T00:00:00Z', notes: '50% upfront deposit', created_at: '2025-08-01T00:00:00Z' },
  { id: 'inv_015', contract_id: 'con_005', client_id: 'cli_003', invoice_number: 'INV-2025-015', amount: 6000, paid_amount: 6000, status: 'paid', due_date: '2025-10-10', paid_at: '2025-10-12T00:00:00Z', notes: 'Final delivery payment', created_at: '2025-10-01T00:00:00Z' },

  // con_006: Marketing Materials ($6,500) — 100%
  { id: 'inv_016', contract_id: 'con_006', client_id: 'cli_003', invoice_number: 'INV-2025-016', amount: 3250, paid_amount: 3250, status: 'paid', due_date: '2025-10-15', paid_at: '2025-10-16T00:00:00Z', notes: '50% upfront deposit', created_at: '2025-10-01T00:00:00Z' },
  { id: 'inv_017', contract_id: 'con_006', client_id: 'cli_003', invoice_number: 'INV-2025-017', amount: 3250, paid_amount: 3250, status: 'paid', due_date: '2025-12-20', paid_at: '2025-12-22T00:00:00Z', notes: 'Final delivery payment', created_at: '2025-12-15T00:00:00Z' },

  // con_007: Pinnacle Brand Overhaul ($38k) — 75% billed, 67% collected, 1 overdue
  { id: 'inv_018', contract_id: 'con_007', client_id: 'cli_004', invoice_number: 'INV-2026-018', amount: 19000, paid_amount: 19000, status: 'paid', due_date: '2026-03-05', paid_at: '2026-03-06T00:00:00Z', notes: '50% upfront deposit', created_at: '2026-03-01T00:00:00Z' },
  { id: 'inv_019', contract_id: 'con_007', client_id: 'cli_004', invoice_number: 'INV-2026-019', amount: 9500, paid_amount: 0, status: 'overdue', due_date: '2026-05-15', notes: 'Milestone payment — visual identity delivery', created_at: '2026-05-01T00:00:00Z' },

  // con_008: Corporate Video ($22k) — 50% billed, 0% collected, 1 overdue
  { id: 'inv_020', contract_id: 'con_008', client_id: 'cli_005', invoice_number: 'INV-2026-020', amount: 11000, paid_amount: 0, status: 'overdue', due_date: '2026-04-30', notes: '50% upfront — contract not yet signed', created_at: '2026-04-01T00:00:00Z' },
]

// ─── Query helpers ────────────────────────────────────────────────────────────

export function getClients(): Client[] {
  return clients
}

export function getClient(id: string): Client | undefined {
  return clients.find(c => c.id === id)
}

export function getContracts(): Contract[] {
  return contracts
}

export function getContractsByClient(clientId: string): Contract[] {
  return contracts.filter(c => c.client_id === clientId)
}

export function getContract(id: string): Contract | undefined {
  return contracts.find(c => c.id === id)
}

export function getLineItemsByContract(contractId: string): ContractLineItem[] {
  return lineItems.filter(li => li.contract_id === contractId)
}

export function getInvoicesByContract(contractId: string): Invoice[] {
  return invoices.filter(inv => inv.contract_id === contractId)
}

export function getInvoicesByClient(clientId: string): Invoice[] {
  return invoices.filter(inv => inv.client_id === clientId)
}

export function getAllInvoices(): Invoice[] {
  return invoices
}

export function getOverdueInvoices(): (Invoice & { client: Client; contract: Contract })[] {
  return invoices
    .filter(inv => inv.status === 'overdue')
    .map(inv => ({
      ...inv,
      client: clients.find(c => c.id === inv.client_id)!,
      contract: contracts.find(c => c.id === inv.contract_id)!,
    }))
}
