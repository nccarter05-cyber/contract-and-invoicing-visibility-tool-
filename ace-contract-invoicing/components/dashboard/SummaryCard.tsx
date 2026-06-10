import { cn } from '@/lib/utils'

interface SummaryCardProps {
  label: string
  value: string
  sub?: string
  accent?: boolean
  alert?: boolean
}

export function SummaryCard({ label, value, sub, accent, alert }: SummaryCardProps) {
  return (
    <div className={cn(
      'rounded-xl border px-6 py-5 flex flex-col gap-1',
      alert
        ? 'border-red-200 bg-red-50'
        : accent
          ? 'border-[var(--gold)] bg-black text-white'
          : 'border-[var(--border)] bg-white'
    )}>
      <p className={cn(
        'text-xs font-medium uppercase tracking-wide',
        alert ? 'text-red-500' : accent ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'
      )}>
        {label}
      </p>
      <p className={cn(
        'text-2xl font-semibold tracking-tight',
        alert ? 'text-red-700' : accent ? 'text-white' : 'text-[var(--text-primary)]'
      )}>
        {value}
      </p>
      {sub && (
        <p className={cn(
          'text-xs',
          alert ? 'text-red-500' : accent ? 'text-zinc-400' : 'text-[var(--text-muted)]'
        )}>
          {sub}
        </p>
      )}
    </div>
  )
}
