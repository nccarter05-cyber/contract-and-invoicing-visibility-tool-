'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency } from '@/lib/utils'
import type { Invoice, InvoiceStatus } from '@/lib/types'

// ── Add Invoice Modal ─────────────────────────────────────────────────────────

interface AddInvoiceModalProps {
  open: boolean
  onClose: () => void
  contractId: string
  clientId: string
  nextInvoiceNumber: string
  onAdd: (invoice: Omit<Invoice, 'id' | 'created_at'>) => void
}

export function AddInvoiceModal({ open, onClose, contractId, clientId, nextInvoiceNumber, onAdd }: AddInvoiceModalProps) {
  const [form, setForm] = useState({
    invoice_number: nextInvoiceNumber,
    amount: '',
    due_date: '',
    notes: '',
    status: 'sent' as InvoiceStatus,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onAdd({
      contract_id: contractId,
      client_id: clientId,
      invoice_number: form.invoice_number,
      amount: parseFloat(form.amount),
      paid_amount: 0,
      status: form.status,
      due_date: form.due_date,
      notes: form.notes,
    })
    setForm({ invoice_number: nextInvoiceNumber, amount: '', due_date: '', notes: '', status: 'sent' })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Invoice">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Invoice #</label>
            <input
              type="text"
              required
              value={form.invoice_number}
              onChange={e => setForm(f => ({ ...f, invoice_number: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Amount ($)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Due Date</label>
            <input
              type="date"
              required
              value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as InvoiceStatus }))}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Notes (optional)</label>
          <input
            type="text"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="e.g. 50% upfront deposit"
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-black text-[var(--gold)] px-4 py-2 text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            Add Invoice
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Mark Paid Modal ───────────────────────────────────────────────────────────

interface MarkPaidModalProps {
  open: boolean
  onClose: () => void
  invoice: Invoice | null
  onConfirm: (invoiceId: string) => void
}

export function MarkPaidModal({ open, onClose, invoice, onConfirm }: MarkPaidModalProps) {
  if (!invoice) return null
  const remaining = invoice.amount - invoice.paid_amount

  return (
    <Modal open={open} onClose={onClose} title="Mark as Paid">
      <div className="space-y-4">
        <div className="rounded-lg bg-zinc-50 border border-[var(--border)] px-4 py-3 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-[var(--text-muted)]">Invoice</span>
            <span className="font-medium">{invoice.invoice_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Amount due</span>
            <span className="font-semibold text-emerald-600">{formatCurrency(remaining)}</span>
          </div>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Mark this invoice as fully paid? This will record {formatCurrency(remaining)} as collected.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(invoice.id); onClose() }}
            className="flex-1 rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Partial Payment Modal ─────────────────────────────────────────────────────

interface PartialPaymentModalProps {
  open: boolean
  onClose: () => void
  invoice: Invoice | null
  onConfirm: (invoiceId: string, amount: number) => void
}

export function PartialPaymentModal({ open, onClose, invoice, onConfirm }: PartialPaymentModalProps) {
  const [amount, setAmount] = useState('')

  if (!invoice) return null
  const remaining = invoice.amount - invoice.paid_amount

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (!parsed || parsed <= 0) return
    onConfirm(invoice!.id, Math.min(parsed, remaining))
    setAmount('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Record Partial Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-zinc-50 border border-[var(--border)] px-4 py-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Invoice</span>
            <span className="font-medium">{invoice.invoice_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Total amount</span>
            <span>{formatCurrency(invoice.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Already paid</span>
            <span>{formatCurrency(invoice.paid_amount)}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--border)] pt-1">
            <span className="text-[var(--text-muted)]">Remaining</span>
            <span className="font-semibold text-amber-600">{formatCurrency(remaining)}</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Payment Amount ($)</label>
          <input
            type="number"
            required
            min="0.01"
            max={remaining}
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-amber-500 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-600 transition-colors"
          >
            Record Payment
          </button>
        </div>
      </form>
    </Modal>
  )
}
