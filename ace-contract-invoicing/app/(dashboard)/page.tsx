import { SummaryCard } from '@/components/dashboard/SummaryCard'
import { ClientBillingRow } from '@/components/dashboard/ClientBillingRow'
import { OverduePanel } from '@/components/dashboard/OverduePanel'
import {
  getClients,
  getContracts,
  getAllInvoices,
  getInvoicesByClient,
  getContractsByClient,
  getOverdueInvoices,
} from '@/lib/data/mock-db'
import { computeClientMetrics, formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const clients = getClients()
  const contracts = getContracts()
  const allInvoices = getAllInvoices()
  const overdueItems = getOverdueInvoices()

  // Global metrics
  const totalContracted = contracts.reduce((s, c) => s + c.total_value, 0)
  const activeInvoices = allInvoices.filter(inv => inv.status !== 'cancelled')
  const totalBilled = activeInvoices.reduce((s, inv) => s + inv.amount, 0)
  const totalCollected = activeInvoices.reduce((s, inv) => s + inv.paid_amount, 0)
  const outstanding = totalBilled - totalCollected
  const overdueCount = allInvoices.filter(inv => inv.status === 'overdue').length

  return (
    <div className="px-8 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Financial overview across all clients and contracts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          label="Total Contracted"
          value={formatCurrency(totalContracted)}
          sub={`${contracts.length} contracts`}
        />
        <SummaryCard
          label="Total Billed"
          value={formatCurrency(totalBilled)}
          sub={`${Math.round((totalBilled / totalContracted) * 100)}% of contracted`}
          accent
        />
        <SummaryCard
          label="Collected"
          value={formatCurrency(totalCollected)}
          sub={`${Math.round((totalCollected / totalBilled) * 100)}% of billed`}
        />
        <SummaryCard
          label="Outstanding"
          value={formatCurrency(outstanding)}
          sub={overdueCount > 0 ? `${overdueCount} invoices overdue` : 'No overdue invoices'}
          alert={overdueCount > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Client list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Clients</h2>
            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-1.5 rounded-full bg-[var(--gold)]" />
                Billed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-1.5 rounded-full bg-emerald-400" />
                Collected
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-white divide-y divide-[var(--border)] overflow-hidden">
            {clients.map(client => {
              const clientContracts = getContractsByClient(client.id)
              const clientInvoices = getInvoicesByClient(client.id)
              return (
                <ClientBillingRow
                  key={client.id}
                  client={client}
                  contracts={clientContracts}
                  invoices={clientInvoices}
                />
              )
            })}
          </div>
        </div>

        {/* Overdue panel */}
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Overdue</h2>
          <OverduePanel
            items={overdueItems.map(item => ({
              invoice: item,
              client: item.client,
              contract: item.contract,
            }))}
          />
        </div>
      </div>
    </div>
  )
}
