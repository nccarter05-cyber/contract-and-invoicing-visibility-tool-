'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency, generateId } from '@/lib/utils'
import type { Client, Contract, ContractStatus } from '@/lib/types'

export interface ImportedContract {
  contract: Contract
  clientName: string
}

const CSV_COLUMNS = ['client', 'title', 'total_value', 'status', 'start_date', 'end_date', 'payment_terms']
const VALID_STATUSES: ContractStatus[] = ['draft', 'sent', 'signed', 'completed', 'cancelled']
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const TEMPLATE = [
  CSV_COLUMNS.join(','),
  'Marlow & Co.,Spring Campaign,15000,signed,2026-07-01,2026-09-30,50% upfront / 50% on delivery',
  'New Client LLC,Logo Refresh,4500,draft,2026-08-01,2026-09-15,Net 30',
].join('\n')

interface ParsedRow {
  line: number
  values: Record<string, string>
  errors: string[]
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++ }
      else if (ch === '"') inQuotes = false
      else current += ch
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields.map(f => f.trim())
}

function validateRow(values: Record<string, string>): string[] {
  const errors: string[] = []
  if (!values.client) errors.push('client is required')
  if (!values.title) errors.push('title is required')
  const value = parseFloat(values.total_value)
  if (!values.total_value || isNaN(value) || value <= 0) errors.push('total_value must be a positive number')
  if (values.status && !VALID_STATUSES.includes(values.status as ContractStatus)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`)
  }
  if (!DATE_RE.test(values.start_date)) errors.push('start_date must be YYYY-MM-DD')
  if (!DATE_RE.test(values.end_date)) errors.push('end_date must be YYYY-MM-DD')
  return errors
}

function parseCsv(text: string): { rows: ParsedRow[]; error?: string } {
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '')
  if (lines.length === 0) return { rows: [], error: 'File is empty.' }

  const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_'))
  const missing = CSV_COLUMNS.filter(c => c !== 'payment_terms' && !headers.includes(c))
  if (missing.length > 0) {
    return { rows: [], error: `Missing required columns: ${missing.join(', ')}` }
  }
  if (lines.length === 1) return { rows: [], error: 'No data rows found below the header.' }

  const rows = lines.slice(1).map((line, i) => {
    const fields = parseCsvLine(line)
    const values: Record<string, string> = {}
    headers.forEach((h, idx) => { values[h] = fields[idx] ?? '' })
    return { line: i + 2, values, errors: validateRow(values) }
  })
  return { rows }
}

interface ImportContractsModalProps {
  open: boolean
  onClose: () => void
  clients: Client[]
  onImport: (imported: ImportedContract[]) => void
}

export function ImportContractsModal({ open, onClose, clients, onImport }: ImportContractsModalProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [parseError, setParseError] = useState<string | null>(null)

  const validRows = rows.filter(r => r.errors.length === 0)

  function reset() {
    setFileName(null)
    setRows([])
    setParseError(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const { rows: parsed, error } = parseCsv(String(reader.result ?? ''))
      setFileName(file.name)
      setRows(parsed)
      setParseError(error ?? null)
    }
    reader.readAsText(file)
  }

  function handleImport() {
    const imported = validRows.map(({ values }) => {
      const client = clients.find(c => c.name.toLowerCase() === values.client.toLowerCase())
      const contract: Contract = {
        id: `con_${generateId()}`,
        client_id: client?.id ?? '',
        title: values.title,
        total_value: parseFloat(values.total_value),
        status: (values.status || 'draft') as ContractStatus,
        start_date: values.start_date,
        end_date: values.end_date,
        payment_terms: values.payment_terms || undefined,
        created_at: new Date().toISOString(),
      }
      return { contract, clientName: client?.name ?? values.client }
    })
    onImport(imported)
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Import Contracts" className="max-w-2xl">
      <div className="space-y-4">
        {!fileName ? (
          <>
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border)] px-6 py-10 cursor-pointer hover:border-[var(--gold)] transition-colors">
              <FileSpreadsheet size={24} className="text-[var(--text-muted)]" />
              <span className="text-sm font-medium text-[var(--text-primary)]">Choose a CSV file</span>
              <span className="text-xs text-[var(--text-muted)]">
                Columns: {CSV_COLUMNS.join(', ')}
              </span>
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
            </label>
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>Imported contracts are session-only and reset on refresh.</span>
              <a
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(TEMPLATE)}`}
                download="contracts-template.csv"
                className="flex items-center gap-1 font-medium text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors"
              >
                <Download size={12} />
                Download template
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
                <FileSpreadsheet size={14} className="text-[var(--text-muted)]" />
                {fileName}
              </span>
              <button
                onClick={reset}
                className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:underline transition-colors"
              >
                Choose a different file
              </button>
            </div>

            {parseError ? (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {parseError}
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-[var(--border)] overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-zinc-50">
                        <th className="text-left px-4 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Contract</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Client</th>
                        <th className="text-right px-4 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Value</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {rows.map(row => (
                        <tr key={row.line} className={row.errors.length > 0 ? 'bg-red-50/50' : undefined}>
                          <td className="px-4 py-2 text-[var(--text-primary)]">{row.values.title || '—'}</td>
                          <td className="px-4 py-2 text-[var(--text-secondary)]">{row.values.client || '—'}</td>
                          <td className="px-4 py-2 text-right text-[var(--text-secondary)]">
                            {row.errors.length === 0 ? formatCurrency(parseFloat(row.values.total_value)) : row.values.total_value || '—'}
                          </td>
                          <td className="px-4 py-2">
                            {row.errors.length === 0 ? (
                              <span className="text-xs font-medium text-emerald-600">Ready</span>
                            ) : (
                              <span className="text-xs text-red-600">{row.errors.join('; ')}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  {validRows.length} of {rows.length} rows ready to import.
                  {rows.length > validRows.length && ' Rows with errors will be skipped.'}
                </p>
              </>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleClose}
                className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={validRows.length === 0}
                className="flex-1 rounded-lg bg-black text-[var(--gold)] px-4 py-2 text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Import {validRows.length > 0 ? `${validRows.length} Contract${validRows.length === 1 ? '' : 's'}` : 'Contracts'}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
