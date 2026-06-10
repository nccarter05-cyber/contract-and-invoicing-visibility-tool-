'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SearchX, Upload } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ImportContractsModal, type ImportedContract } from '@/components/contracts/ImportContractsModal'
import { formatCurrency, formatDate, pct, computeBillingMetrics, isContractAtRisk } from '@/lib/utils'
import type { Client, Contract, ContractStatus, Invoice } from '@/lib/types'

type StatusFilter = 'all' | ContractStatus | 'at_risk'

interface ContractsExplorerProps {
  clients: Client[]
  contracts: Contract[]
  invoices: Invoice[]
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'at_risk', label: 'At Risk' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'signed', label: 'Signed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function ContractsExplorer({ clients, contracts, invoices }: ContractsExplorerProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [clientFilter, setClientFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [imported, setImported] = useState<ImportedContract[]>([])
  const [importOpen, setImportOpen] = useState(false)

  const rows = useMemo(() => {
    const base = contracts.map(contract => {
      const contractInvoices = invoices.filter(inv => inv.contract_id === contract.id)
      return {
        contract,
        clientName: clients.find(c => c.id === contract.client_id)?.name ?? '—',
        metrics: computeBillingMetrics(contract.total_value, contractInvoices),
        atRisk: isContractAtRisk(contract, contractInvoices),
        imported: false,
      }
    })
    const extra = imported.map(({ contract, clientName }) => ({
      contract,
      clientName,
      metrics: computeBillingMetrics(contract.total_value, []),
      atRisk: false,
      imported: true,
    }))
    return [...base, ...extra].sort(
      (a, b) => new Date(b.contract.start_date).getTime() - new Date(a.contract.start_date).getTime()
    )
  }, [clients, contracts, invoices, imported])

  const filtered = rows.filter(row => {
    if (search) {
      const q = search.toLowerCase()
      if (!row.contract.title.toLowerCase().includes(q) && !row.clientName.toLowerCase().includes(q)) return false
    }
    if (clientFilter !== 'all' && row.contract.client_id !== clientFilter) return false
    if (statusFilter === 'at_risk') {
      if (!row.atRisk) return false
    } else if (statusFilter !== 'all' && row.contract.status !== statusFilter) {
      return false
    }
    // Date range matches contracts whose period overlaps the selected window
    if (dateFrom && row.contract.end_date < dateFrom) return false
    if (dateTo && row.contract.start_date > dateTo) return false
    return true
  })

  const hasFilters = search !== '' || clientFilter !== 'all' || statusFilter !== 'all' || dateFrom !== '' || dateTo !== ''
  const totalValue = filtered.reduce((s, r) => s + r.contract.total_value, 0)
  const atRiskCount = filtered.filter(r => r.atRisk).length

  function clearFilters() {
    setSearch('')
    setClientFilter('all')
    setStatusFilter('all')
    setDateFrom('')
    setDateTo('')
  }

  const inputClass = 'rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors'

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search contracts or clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`${inputClass} w-full pl-9`}
          />
        </div>
        <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} className={inputClass}>
          <option value="all">All clients</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusFilter)} className={inputClass}>
          {statusOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className={inputClass}
            aria-label="Active from"
          />
          <span className="text-xs text-[var(--text-muted)]">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className={inputClass}
            aria-label="Active to"
          />
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:underline transition-colors"
          >
            Clear
          </button>
        )}
        <button
          onClick={() => setImportOpen(true)}
          className="flex items-center gap-1.5 text-xs font-medium bg-black text-[var(--gold)] rounded-lg px-3 py-2 hover:bg-zinc-800 transition-colors ml-auto"
        >
          <Upload size={12} />
          Import CSV
        </button>
      </div>

      {/* Summary line */}
      <p className="text-xs text-[var(--text-muted)] mb-3">
        {filtered.length} contract{filtered.length === 1 ? '' : 's'} · {formatCurrency(totalValue)} total value
        {atRiskCount > 0 && <span className="text-orange-600"> · {atRiskCount} at risk</span>}
      </p>

      {/* Table */}
      <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
            <SearchX size={20} className="text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">No contracts match your filters.</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-[var(--gold)] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-zinc-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Contract</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Value</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Billed</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Collected</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map(({ contract, clientName, metrics, atRisk, imported: isImported }) => (
                  <tr
                    key={contract.id}
                    onClick={isImported ? undefined : () => router.push(`/contracts/${contract.id}`)}
                    className={`transition-colors ${isImported ? '' : 'cursor-pointer hover:bg-zinc-50/50'}`}
                  >
                    <td className="px-6 py-3.5">
                      <span className="font-medium text-[var(--text-primary)]">{contract.title}</span>
                      {isImported && (
                        <span className="ml-2 text-[10px] font-medium text-[var(--text-muted)] bg-zinc-100 rounded-full px-2 py-0.5">
                          Imported
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-[var(--text-secondary)]">{clientName}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Badge status={contract.status} />
                        {atRisk && <Badge status="at_risk" />}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-[var(--text-primary)]">
                      {formatCurrency(contract.total_value)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-zinc-100 overflow-hidden shrink-0">
                          <div
                            className={`h-full rounded-full ${metrics.is_overbilled ? 'bg-red-400' : 'bg-[var(--gold)]'}`}
                            style={{ width: `${Math.min(metrics.billing_coverage, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs ${metrics.is_overbilled ? 'text-red-600 font-medium' : 'text-[var(--text-muted)]'}`}>
                          {pct(metrics.billing_coverage)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-zinc-100 overflow-hidden shrink-0">
                          <div
                            className="h-full rounded-full bg-emerald-400"
                            style={{ width: `${Math.min(metrics.collection_rate, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">{pct(metrics.collection_rate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-[var(--text-secondary)] whitespace-nowrap">
                      {formatDate(contract.start_date)} — {formatDate(contract.end_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ImportContractsModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        clients={clients}
        onImport={newContracts => setImported(prev => [...prev, ...newContracts])}
      />
    </div>
  )
}
