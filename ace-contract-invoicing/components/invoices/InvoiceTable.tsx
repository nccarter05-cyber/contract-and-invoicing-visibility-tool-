import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Invoice } from '@/lib/types'

interface InvoiceTableProps {
  invoices: Invoice[]
  onMarkPaid?: (invoice: Invoice) => void
  onPartialPayment?: (invoice: Invoice) => void
  onAddInvoice?: () => void
}

export function InvoiceTable({ invoices, onMarkPaid, onPartialPayment, onAddInvoice }: InvoiceTableProps) {
  const sorted = [...invoices].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Invoices</h3>
        {onAddInvoice && (
          <button
            onClick={onAddInvoice}
            className="text-xs font-medium bg-black text-[var(--gold)] rounded-lg px-3 py-1.5 hover:bg-zinc-800 transition-colors"
          >
            + Add Invoice
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-[var(--text-muted)]">
          No invoices yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-zinc-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Invoice #</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Amount</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Paid</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Due</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {sorted.map(inv => (
                <tr key={inv.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div>
                      <span className="font-medium text-[var(--text-primary)]">{inv.invoice_number}</span>
                      {inv.notes && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5 max-w-xs truncate">{inv.notes}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-[var(--text-primary)]">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={inv.paid_amount > 0 ? 'text-emerald-600 font-medium' : 'text-[var(--text-muted)]'}>
                      {formatCurrency(inv.paid_amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge status={inv.status} />
                  </td>
                  <td className="px-4 py-3.5 text-[var(--text-secondary)]">
                    {formatDate(inv.due_date)}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      {inv.status !== 'paid' && inv.status !== 'cancelled' && onMarkPaid && (
                        <button
                          onClick={() => onMarkPaid(inv)}
                          className="text-xs text-emerald-700 hover:text-emerald-900 font-medium hover:underline transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                      {(inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'partially_paid') && onPartialPayment && (
                        <button
                          onClick={() => onPartialPayment(inv)}
                          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium hover:underline transition-colors"
                        >
                          Partial
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
