import { cn } from '@/lib/utils'
import type { ContractStatus, InvoiceStatus } from '@/lib/types'

type Status = ContractStatus | InvoiceStatus | 'at_risk'

const variants: Record<Status, string> = {
  draft: 'bg-zinc-100 text-zinc-600',
  sent: 'bg-blue-50 text-blue-700',
  signed: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-zinc-100 text-zinc-500',
  cancelled: 'bg-red-50 text-red-400 line-through',
  paid: 'bg-emerald-50 text-emerald-700',
  partially_paid: 'bg-amber-50 text-amber-700',
  overdue: 'bg-red-50 text-red-600',
  at_risk: 'bg-orange-50 text-orange-700',
}

const labels: Record<Status, string> = {
  draft: 'Draft',
  sent: 'Sent',
  signed: 'Signed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  paid: 'Paid',
  partially_paid: 'Partial',
  overdue: 'Overdue',
  at_risk: 'At Risk',
}

interface BadgeProps {
  status: Status
  className?: string
}

export function Badge({ status, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variants[status],
      className
    )}>
      {labels[status]}
    </span>
  )
}
