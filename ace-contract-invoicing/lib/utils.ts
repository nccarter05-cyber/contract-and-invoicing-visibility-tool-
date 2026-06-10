import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Contract, Invoice, BillingMetrics } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date()
}

export function computeBillingMetrics(
  contractValue: number,
  invoices: Invoice[]
): BillingMetrics {
  const activeInvoices = invoices.filter(inv => inv.status !== 'cancelled')
  const total_billed = activeInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const total_collected = activeInvoices.reduce((sum, inv) => sum + inv.paid_amount, 0)
  const outstanding = total_billed - total_collected
  const billing_coverage = contractValue > 0 ? (total_billed / contractValue) * 100 : 0
  const collection_rate = total_billed > 0 ? (total_collected / total_billed) * 100 : 0
  const overdue_count = activeInvoices.filter(
    inv => inv.status === 'overdue' || (inv.status === 'sent' && isOverdue(inv.due_date))
  ).length

  return {
    total_value: contractValue,
    total_billed,
    total_collected,
    outstanding,
    billing_coverage,
    collection_rate,
    is_overbilled: billing_coverage > 100,
    overdue_count,
  }
}

export function computeClientMetrics(contracts: { total_value: number }[], invoices: Invoice[]) {
  const total_contracted = contracts.reduce((sum, c) => sum + c.total_value, 0)
  const metrics = computeBillingMetrics(total_contracted, invoices)
  return { ...metrics, total_value: total_contracted }
}

export function isContractAtRisk(contract: Pick<Contract, 'status'>, invoices: Invoice[]): boolean {
  if (contract.status !== 'signed' && contract.status !== 'sent') return false
  return invoices.some(
    inv => inv.status === 'overdue' || (inv.status === 'sent' && isOverdue(inv.due_date))
  )
}

export function pct(value: number): string {
  return `${Math.round(value)}%`
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}
