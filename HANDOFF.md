# ACE Contract & Invoicing Tool — Handoff

## What This Is

A standalone demo/ops tool for ACE Creatives. Angie (Ops Manager) uses it to audit billing accuracy per contract — "have we billed correctly, what's collected, what's outstanding?" No backend — full UI with realistic mock data by user request.

---

## Project Location
```
c:\Users\mntca\claude code\ACE creatives\Contract & Invoicing Visibility Tool\ace-contract-invoicing\
```

---

## Stack

- **Next.js 15.5.19** (App Router) + TypeScript — note: `package.json` may say otherwise; `node -e "console.log(require('next/package.json').version)"` confirms 15.5.19 installed. There is no `node_modules/next/dist/docs/` directory despite what AGENTS.md says. Standard Next 15 conventions apply (`params` is a Promise — `await params`, already done everywhere).
- **Tailwind CSS v4** — brand colors defined as CSS vars in `globals.css`
- **No Supabase, no localStorage, no Context** — mock data only, server components read from `lib/data/mock-db.ts`, client components manage local `useState`

---

## Current State — Everything Is Built

### All files created and TypeScript-clean (zero errors)

| File | Notes |
|---|---|
| `lib/types.ts` | Client, Contract, ContractLineItem, Invoice, BillingMetrics |
| `lib/utils.ts` | formatCurrency, formatDate, computeBillingMetrics, computeClientMetrics, pct, generateId |
| `lib/data/mock-db.ts` | 5 clients, 8 contracts, 34 line items, 20 invoices |
| `components/ui/Badge.tsx` | Status badges for contract + invoice statuses |
| `components/ui/Card.tsx` | |
| `components/ui/Modal.tsx` | Esc-to-close, backdrop click |
| `components/dashboard/SummaryCard.tsx` | Accent (gold on black) + alert (red) variants |
| `components/dashboard/ClientBillingRow.tsx` | Inline progress bars, click → `/clients/[id]` |
| `components/dashboard/OverduePanel.tsx` | Red panel, links to contract detail |
| `components/contracts/ContractCard.tsx` | Hover → gold border, billed/collected bars |
| `components/contracts/ContractLineItems.tsx` | Scope of work table |
| `components/contracts/BillingHealthStrip.tsx` | Metric grid + dual progress bars |
| `components/invoices/InvoiceTable.tsx` | Sortable by date, inline Mark Paid / Partial buttons |
| `components/invoices/InvoiceModal.tsx` | AddInvoiceModal, MarkPaidModal, PartialPaymentModal |
| `app/layout.tsx` | Root layout |
| `app/globals.css` | Brand CSS vars + Tailwind v4 `@theme inline` |
| `app/login/page.tsx` | Magic link UI, "Skip to demo →" link |
| `app/(dashboard)/layout.tsx` | Black sidebar, ACE brand, Angie user block |
| `app/(dashboard)/page.tsx` | Summary cards + client list + overdue panel |
| `app/(dashboard)/clients/[id]/page.tsx` | Client header, metrics, contract cards |
| `app/(dashboard)/contracts/[id]/page.tsx` | Server component — contract header + line items, shows At Risk badge |
| `app/(dashboard)/contracts/[id]/ContractDetailClient.tsx` | `'use client'` — manages invoice useState, opens modals |
| `app/(dashboard)/contracts/page.tsx` | Contract list page — header + ContractsExplorer |
| `components/contracts/ContractsExplorer.tsx` | `'use client'` — table of all contracts, search (title/client), client + status filters (incl. At Risk), date-range overlap filter, summary line, hosts import modal |
| `components/contracts/ImportContractsModal.tsx` | CSV import — quote-aware parser, per-row validation, preview with errors, template download. Imported contracts are session-only `useState`, tagged "Imported", no detail page (rows not clickable) |

### At-risk tagging

`isContractAtRisk()` in `lib/utils.ts` — derived status, not stored: contract is `signed` or `sent` AND has any invoice that's `overdue` or `sent` past its due date. Rendered via `Badge status="at_risk"` (orange) on the list page, ContractCard, and contract detail header. As of June 2026 mock data, 4 contracts are at risk (con_001, con_002, con_007, con_008).

### CSV import format

Header: `client,title,total_value,status,start_date,end_date,payment_terms` (payment_terms optional). Dates YYYY-MM-DD, status must be a valid ContractStatus (blank → draft). Client matched to existing clients by case-insensitive name; unmatched names display as-is.

---

## Verified Working (June 2026 session)

App runs and was walked through with Playwright — dashboard, client detail, contract detail, add invoice/mark paid/partial modals, contract list, all filters, CSV import end-to-end (valid rows imported, invalid rejected with messages). Zero console errors. `tsc --noEmit` clean.

Screenshots in the parent folder, including `contracts-list.png`.

---

## What Still Needs Doing (all optional polish)

- **Mobile layout** — sidebar doesn't collapse on small screens. Acceptable for an ops tool but worth a hamburger toggle eventually.
- **Import date validation is format-only** — `2026-13-99` passes the YYYY-MM-DD regex. Could add a real calendar-validity check.
- **`formatDate` off-by-one** — dates render one day early (UTC parse vs local display), e.g. start_date `2026-04-01` shows "Mar 31, 2026". Pre-existing, affects all pages equally.

---

## Mock Data Scenarios

| Scenario | Where to find it |
|---|---|
| Overbilled contract | Vantage Properties → Property Marketing Package ($9,750 billed on $9,500 contract) |
| Partially paid invoice | Marlow & Co. → Social Media Retainer → INV-2026-008 ($1,500 of $3,000 paid) |
| 3 overdue invoices | Marlow Brand INV-2026-003 ($10k), Pinnacle INV-2026-019 ($9.5k), Horizon INV-2026-020 ($11k) |
| 100% billed & collected | Blue Ridge Coffee — both contracts fully paid |
| 0% collected | Horizon Tech — $11k invoiced, nothing paid |

**Dashboard totals:** $179k contracted · $150,750 billed · $115,750 collected · $35k outstanding · 3 overdue

---

## Brand Colors (globals.css)

- `--gold: #C9A84C` → use as `text-[var(--gold)]` or `bg-gold` (via `@theme inline`)
- `--sidebar-bg: #0f0f0f`
- `--content-bg: #fafafa`
- `--card-bg / --border / --text-primary / --text-secondary / --text-muted`

---

## Dev Server / PowerShell Notes (this machine)

The project path contains `&`, which breaks npm-script `.cmd` shims, and lowercase `c:\` causes a duplicate-module React crash. Start the dev server with node directly, uppercase `C:\`, port 3002 (3000 is occupied):

```powershell
Set-Location "C:\Users\mntca\claude code\ACE creatives\Contract & Invoicing Visibility Tool\ace-contract-invoicing"
node "C:\Users\mntca\claude code\ACE creatives\Contract & Invoicing Visibility Tool\ace-contract-invoicing\node_modules\next\dist\bin\next" dev --port 3002
```

A dev server may already be running on 3002 from a previous session (check before starting — `EADDRINUSE` means it's already up and will hot-reload your changes).

Type check: `node node_modules/typescript/bin/tsc --noEmit`
