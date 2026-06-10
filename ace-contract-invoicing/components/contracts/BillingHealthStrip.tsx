import { formatCurrency, pct } from '@/lib/utils'
import type { BillingMetrics } from '@/lib/types'

interface BillingHealthStripProps {
  metrics: BillingMetrics
}

export function BillingHealthStrip({ metrics }: BillingHealthStripProps) {
  const billingPct = Math.min(metrics.billing_coverage, 100)
  const collectionPct = metrics.collection_rate

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Billing Health</h3>
        {metrics.is_overbilled && (
          <span className="text-xs font-semibold text-red-600 bg-red-50 rounded-full px-2.5 py-1 border border-red-200">
            Overbilled {pct(metrics.billing_coverage)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <Stat label="Contract Value" value={formatCurrency(metrics.total_value)} />
        <Stat label="Total Billed" value={formatCurrency(metrics.total_billed)} />
        <Stat label="Collected" value={formatCurrency(metrics.total_collected)} highlight />
        <Stat
          label="Outstanding"
          value={formatCurrency(metrics.outstanding)}
          alert={metrics.outstanding > 0}
        />
      </div>

      <div className="space-y-3">
        <ProgressRow
          label="Billed"
          pct={billingPct}
          value={`${pct(metrics.billing_coverage)} of contract`}
          color={metrics.is_overbilled ? 'bg-red-400' : 'bg-[var(--gold)]'}
        />
        <ProgressRow
          label="Collected"
          pct={collectionPct}
          value={`${pct(metrics.collection_rate)} of billed`}
          color="bg-emerald-400"
        />
      </div>
    </div>
  )
}

function Stat({ label, value, highlight, alert }: { label: string; value: string; highlight?: boolean; alert?: boolean }) {
  return (
    <div>
      <p className="text-xs text-[var(--text-muted)] mb-0.5">{label}</p>
      <p className={`text-base font-semibold ${alert ? 'text-red-600' : highlight ? 'text-emerald-600' : 'text-[var(--text-primary)]'}`}>
        {value}
      </p>
    </div>
  )
}

function ProgressRow({ label, pct: pctValue, value, color }: { label: string; pct: number; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--text-muted)] w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pctValue}%` }}
        />
      </div>
      <span className="text-xs text-[var(--text-secondary)] w-32 text-right shrink-0">{value}</span>
    </div>
  )
}
