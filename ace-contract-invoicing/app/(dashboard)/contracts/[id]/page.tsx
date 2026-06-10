import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Calendar, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ContractLineItems } from '@/components/contracts/ContractLineItems'
import { ContractDetailClient } from './ContractDetailClient'
import {
  getContract,
  getClient,
  getLineItemsByContract,
  getInvoicesByContract,
} from '@/lib/data/mock-db'
import { formatCurrency, formatDate, isContractAtRisk } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ContractDetailPage({ params }: Props) {
  const { id } = await params
  const contract = getContract(id)
  if (!contract) notFound()

  const client = getClient(contract.client_id)
  const lineItems = getLineItemsByContract(id)
  const invoices = getInvoicesByContract(id)

  return (
    <div className="px-8 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        {client && (
          <>
            <Link href={`/clients/${client.id}`} className="hover:text-[var(--text-primary)] transition-colors">
              {client.name}
            </Link>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-[var(--text-primary)] font-medium truncate">{contract.title}</span>
      </nav>

      {/* Contract header */}
      <div className="rounded-xl border border-[var(--border)] bg-white px-6 py-5 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {client && (
                <Link
                  href={`/clients/${client.id}`}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors font-medium"
                >
                  {client.name}
                </Link>
              )}
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">{contract.title}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isContractAtRisk(contract, invoices) && <Badge status="at_risk" />}
            <Badge status={contract.status} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-0.5">Contract Value</p>
            <p className="font-bold text-lg text-[var(--text-primary)]">{formatCurrency(contract.total_value)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-0.5">Duration</p>
            <p className="text-[var(--text-primary)] flex items-center gap-1 text-xs">
              <Calendar size={11} className="shrink-0" />
              {formatDate(contract.start_date)} — {formatDate(contract.end_date)}
            </p>
          </div>
          {contract.payment_terms && (
            <div className="col-span-2">
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Payment Terms</p>
              <p className="text-[var(--text-primary)] text-xs">{contract.payment_terms}</p>
            </div>
          )}
        </div>

        {contract.notes && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mb-1">
              <FileText size={11} />
              Notes
            </p>
            <p className="text-sm text-[var(--text-secondary)]">{contract.notes}</p>
          </div>
        )}
      </div>

      {/* Line items */}
      <div className="mb-6">
        <ContractLineItems items={lineItems} totalValue={contract.total_value} />
      </div>

      {/* Billing health + invoice table (client component for interactivity) */}
      <div className="space-y-6">
        <ContractDetailClient contract={contract} initialInvoices={invoices} />
      </div>
    </div>
  )
}
