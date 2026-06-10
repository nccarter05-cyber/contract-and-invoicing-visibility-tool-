export type ContractStatus = 'draft' | 'sent' | 'signed' | 'completed' | 'cancelled'

export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'

export interface Client {
  id: string
  name: string
  industry: string
  website?: string
  created_at: string
}

export interface ContractLineItem {
  id: string
  contract_id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Contract {
  id: string
  client_id: string
  title: string
  total_value: number
  status: ContractStatus
  start_date: string
  end_date: string
  payment_terms?: string
  notes?: string
  document_url?: string
  created_at: string
  signed_at?: string
}

export interface Invoice {
  id: string
  contract_id: string
  client_id: string
  invoice_number: string
  amount: number
  paid_amount: number
  status: InvoiceStatus
  due_date: string
  paid_at?: string
  notes?: string
  created_at: string
}

export interface BillingMetrics {
  total_value: number
  total_billed: number
  total_collected: number
  outstanding: number
  billing_coverage: number
  collection_rate: number
  is_overbilled: boolean
  overdue_count: number
}
