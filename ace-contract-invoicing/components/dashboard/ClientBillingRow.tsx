import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { formatCurrency, pct, computeBillingMetrics } from '@/lib/utils'
import type { Client, Contract, Invoice } from '@/lib/types'

interface ClientBillingRowProps {
  client: Client
  contracts: Contract[]
  invoices: Invoice[]
}

export function ClientBillingRow({ client, contracts, invoices }: ClientBillingRowProps) {
  const totalValue = contracts.reduce((s, c) => s + c.total_value, 0)
  const metrics = computeBillingMetrics(totalValue, invoices)
  const activeContracts = contracts.filter(c => c.status === 'signed' || c.status === 'sent').length

  return (
    <Link
      href={`/clients/${client.id}`}
      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-zinc-50 transition-colors group"
    >
      <div className="w-8 h-8 rounded-full bg-black text-[var(--gold)] flex items-center justify-center text-xs font-bold shrink-0">
        {client.name.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">{client.name}</span>
          {activeContracts > 0 && (
            <span className="text-xs text-[var(--text-muted)] shrink-0">{activeContracts} active</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--gold)] transition-all"
              style={{ width: `${Math.min(metrics.billing_coverage, 100)}%` }}
            />
          </div>
          <div className="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all"
              style={{ width: `${metrics.collection_rate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          {formatCurrency(metrics.outstanding)}
        </span>
        <span className="text-xs text-[var(--text-muted)]">outstanding</span>
      </div>

      <div className="hidden md:flex flex-col items-end gap-0.5 shrink-0 w-20">
        <span className="text-xs font-medium text-[var(--text-primary)]">{pct(metrics.billing_coverage)} billed</span>
        <span className="text-xs text-[var(--text-muted)]">{pct(metrics.collection_rate)} collected</span>
      </div>

      {metrics.overdue_count > 0 && (
        <span className="shrink-0 rounded-full bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5">
          {metrics.overdue_count} overdue
        </span>
      )}

      <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] shrink-0 transition-colors" />
    </Link>
  )
}
