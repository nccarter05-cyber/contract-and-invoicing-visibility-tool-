import { ContractsExplorer } from '@/components/contracts/ContractsExplorer'
import { getClients, getContracts, getAllInvoices } from '@/lib/data/mock-db'

export default function ContractsPage() {
  return (
    <div className="px-8 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Contracts</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">All contracts across clients — search, filter, and import</p>
      </div>

      <ContractsExplorer
        clients={getClients()}
        contracts={getContracts()}
        invoices={getAllInvoices()}
      />
    </div>
  )
}
