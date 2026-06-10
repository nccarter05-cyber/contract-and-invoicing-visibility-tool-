'use client'

import { useState } from 'react'
import { InvoiceTable } from '@/components/invoices/InvoiceTable'
import { AddInvoiceModal, MarkPaidModal, PartialPaymentModal } from '@/components/invoices/InvoiceModal'
import { BillingHealthStrip } from '@/components/contracts/BillingHealthStrip'
import { computeBillingMetrics, generateId } from '@/lib/utils'
import type { Invoice, Contract } from '@/lib/types'

interface ContractDetailClientProps {
  contract: Contract
  initialInvoices: Invoice[]
}

export function ContractDetailClient({ contract, initialInvoices }: ContractDetailClientProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [addOpen, setAddOpen] = useState(false)
  const [markPaidInvoice, setMarkPaidInvoice] = useState<Invoice | null>(null)
  const [partialInvoice, setPartialInvoice] = useState<Invoice | null>(null)

  const metrics = computeBillingMetrics(contract.total_value, invoices)

  function getNextInvoiceNumber() {
    const max = invoices.reduce((n, inv) => {
      const m = inv.invoice_number.match(/(\d+)$/)
      return m ? Math.max(n, parseInt(m[1])) : n
    }, 20)
    return `INV-2026-${String(max + 1).padStart(3, '0')}`
  }

  function handleAdd(data: Omit<Invoice, 'id' | 'created_at'>) {
    setInvoices(prev => [
      ...prev,
      { ...data, id: `inv_${generateId()}`, created_at: new Date().toISOString() },
    ])
  }

  function handleMarkPaid(invoiceId: string) {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === invoiceId
          ? { ...inv, paid_amount: inv.amount, status: 'paid', paid_at: new Date().toISOString() }
          : inv
      )
    )
  }

  function handlePartialPayment(invoiceId: string, amount: number) {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id !== invoiceId) return inv
        const newPaid = inv.paid_amount + amount
        const isFullyPaid = newPaid >= inv.amount
        return {
          ...inv,
          paid_amount: newPaid,
          status: isFullyPaid ? 'paid' : 'partially_paid',
          paid_at: isFullyPaid ? new Date().toISOString() : undefined,
        }
      })
    )
  }

  return (
    <>
      <BillingHealthStrip metrics={metrics} />

      <InvoiceTable
        invoices={invoices}
        onAddInvoice={() => setAddOpen(true)}
        onMarkPaid={setMarkPaidInvoice}
        onPartialPayment={setPartialInvoice}
      />

      <AddInvoiceModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        contractId={contract.id}
        clientId={contract.client_id}
        nextInvoiceNumber={getNextInvoiceNumber()}
        onAdd={handleAdd}
      />

      <MarkPaidModal
        open={markPaidInvoice !== null}
        onClose={() => setMarkPaidInvoice(null)}
        invoice={markPaidInvoice}
        onConfirm={handleMarkPaid}
      />

      <PartialPaymentModal
        open={partialInvoice !== null}
        onClose={() => setPartialInvoice(null)}
        invoice={partialInvoice}
        onConfirm={handlePartialPayment}
      />
    </>
  )
}
