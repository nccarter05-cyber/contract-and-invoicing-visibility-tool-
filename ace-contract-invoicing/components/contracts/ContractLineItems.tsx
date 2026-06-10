import { formatCurrency } from '@/lib/utils'
import type { ContractLineItem } from '@/lib/types'

interface ContractLineItemsProps {
  items: ContractLineItem[]
  totalValue: number
}

export function ContractLineItems({ items, totalValue }: ContractLineItemsProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Scope of Work</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-zinc-50">
            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Description</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Qty</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Rate</th>
            <th className="text-right px-6 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
              <td className="px-6 py-3 text-[var(--text-primary)]">{item.description}</td>
              <td className="px-4 py-3 text-right text-[var(--text-secondary)]">{item.quantity}</td>
              <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                {item.rate > 0 ? formatCurrency(item.rate) : '—'}
              </td>
              <td className="px-6 py-3 text-right font-medium text-[var(--text-primary)]">
                {formatCurrency(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-[var(--border)] bg-zinc-50">
            <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-[var(--text-primary)]">Total Contract Value</td>
            <td className="px-6 py-3 text-right text-sm font-bold text-[var(--text-primary)]">
              {formatCurrency(totalValue)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
