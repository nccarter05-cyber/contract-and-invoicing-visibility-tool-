import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Globe, Building2 } from 'lucide-react'
import { ContractCard } from '@/components/contracts/ContractCard'
import { SummaryCard } from '@/components/dashboard/SummaryCard'
import {
  getClient,
  getContractsByClient,
  getInvoicesByClient,
  getInvoicesByContract,
} from '@/lib/data/mock-db'
import { formatCurrency, pct, computeClientMetrics } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params
  const client = getClient(id)
  if (!client) notFound()

  const contracts = getContractsByClient(id)
  const clientInvoices = getInvoicesByClient(id)
  const metrics = computeClientMetrics(contracts, clientInvoices)

  const activeContracts = contracts.filter(c => c.status === 'signed' || c.status === 'sent')
  const completedContracts = contracts.filter(c => c.status === 'completed')

  return (
    <div className="px-8 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text-primary)] font-medium">{client.name}</span>
      </nav>

      {/* Client header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-black text-[var(--gold)] flex items-center justify-center text-lg font-bold shrink-0">
          {client.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{client.name}</h1>
          <div className="flex items-center gap-4 mt-1">
            {client.industry && (
              <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Building2 size={11} />
                {client.industry}
              </span>
            )}
            {client.website && (
              <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Globe size={11} />
                {client.website}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard label="Contracted" value={formatCurrency(metrics.total_value)} sub={`${contracts.length} contracts`} />
        <SummaryCard label="Billed" value={formatCurrency(metrics.total_billed)} sub={`${pct(metrics.billing_coverage)} of contracted`} accent />
        <SummaryCard label="Collected" value={formatCurrency(metrics.total_collected)} sub={`${pct(metrics.collection_rate)} of billed`} />
        <SummaryCard
          label="Outstanding"
          value={formatCurrency(metrics.outstanding)}
          sub={metrics.overdue_count > 0 ? `${metrics.overdue_count} overdue` : undefined}
          alert={metrics.overdue_count > 0}
        />
      </div>

      {/* Active contracts */}
      {activeContracts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Active Contracts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeContracts.map(contract => (
              <ContractCard
                key={contract.id}
                contract={contract}
                invoices={getInvoicesByContract(contract.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed contracts */}
      {completedContracts.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--text-muted)] mb-3">Completed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {completedContracts.map(contract => (
              <ContractCard
                key={contract.id}
                contract={contract}
                invoices={getInvoicesByContract(contract.id)}
              />
            ))}
          </div>
        </section>
      )}

      {contracts.length === 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-white px-8 py-12 text-center">
          <p className="text-sm text-[var(--text-muted)]">No contracts yet for this client.</p>
        </div>
      )}
    </div>
  )
}
