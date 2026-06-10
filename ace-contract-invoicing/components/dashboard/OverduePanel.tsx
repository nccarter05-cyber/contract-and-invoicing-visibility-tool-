import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Client, Contract, Invoice } from '@/lib/types'

interface OverdueItem {
  invoice: Invoice
  client: Client
  contract: Contract
}

interface OverduePanelProps {
  items: OverdueItem[]
}

export function OverduePanel({ items }: OverduePanelProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-white px-6 py-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">No overdue invoices</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-red-200">
        <AlertCircle size={14} className="text-red-500" />
        <span className="text-sm font-semibold text-red-700">Overdue Invoices</span>
        <span className="ml-auto rounded-full bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5">
          {items.length}
        </span>
      </div>
      <div className="divide-y divide-red-100">
        {items.map(({ invoice, client, contract }) => (
          <Link
            key={invoice.id}
            href={`/contracts/${contract.id}`}
            className="flex items-center justify-between px-5 py-3 hover:bg-red-100/60 transition-colors group"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-red-800 truncate">{invoice.invoice_number}</p>
              <p className="text-xs text-red-500 truncate">{client.name} — {contract.title}</p>
            </div>
            <div className="flex flex-col items-end shrink-0 ml-4">
              <span className="text-sm font-semibold text-red-700">{formatCurrency(invoice.amount)}</span>
              <span className="text-xs text-red-400">Due {formatDate(invoice.due_date)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
