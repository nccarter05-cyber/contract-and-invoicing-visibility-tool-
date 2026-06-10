import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate, pct, computeBillingMetrics, isContractAtRisk } from '@/lib/utils'
import type { Contract, Invoice } from '@/lib/types'

interface ContractCardProps {
  contract: Contract
  invoices: Invoice[]
}

export function ContractCard({ contract, invoices }: ContractCardProps) {
  const metrics = computeBillingMetrics(contract.total_value, invoices)
  const atRisk = isContractAtRisk(contract, invoices)

  return (
    <Link href={`/contracts/${contract.id}`} className="block group">
      <div className="rounded-xl border border-[var(--border)] bg-white p-5 hover:border-[var(--gold)] hover:shadow-md transition-all duration-150">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">{contract.title}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {formatDate(contract.start_date)} — {formatDate(contract.end_date)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {atRisk && <Badge status="at_risk" />}
            <Badge status={contract.status} />
            <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--gold)] transition-colors" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-[var(--text-primary)]">
            {formatCurrency(contract.total_value)}
          </span>
          {metrics.is_overbilled && (
            <span className="text-xs font-medium text-red-600 bg-red-50 rounded-full px-2 py-0.5">
              Overbilled
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${metrics.is_overbilled ? 'bg-red-400' : 'bg-[var(--gold)]'}`}
                style={{ width: `${Math.min(metrics.billing_coverage, 100)}%` }}
              />
            </div>
            <span className="text-xs text-[var(--text-muted)] w-20 text-right shrink-0">
              {pct(metrics.billing_coverage)} billed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{ width: `${metrics.collection_rate}%` }}
              />
            </div>
            <span className="text-xs text-[var(--text-muted)] w-20 text-right shrink-0">
              {pct(metrics.collection_rate)} collected
            </span>
          </div>
        </div>

        {metrics.outstanding > 0 && (
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            {formatCurrency(metrics.outstanding)} outstanding
            {metrics.overdue_count > 0 && (
              <span className="text-red-500 ml-2">· {metrics.overdue_count} overdue</span>
            )}
          </p>
        )}
      </div>
    </Link>
  )
}
