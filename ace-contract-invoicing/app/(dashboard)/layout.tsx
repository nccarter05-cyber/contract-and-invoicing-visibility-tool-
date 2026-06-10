import Link from 'next/link'
import { FileSignature, LayoutDashboard, LogOut } from 'lucide-react'
import { SidebarNav } from '@/components/dashboard/SidebarNav'

const navLinks = [
  { href: '/', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
  { href: '/contracts', icon: <FileSignature size={15} />, label: 'Contracts' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--gold)] flex items-center justify-center shrink-0">
              <span className="text-black font-bold text-xs">AC</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">ACE Creatives</p>
              <p className="text-[10px] text-zinc-500 leading-tight">Contracts & Invoicing</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <SidebarNav links={navLinks} />

        {/* User */}
        <div className="px-3 py-4 border-t border-[var(--sidebar-border)]">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
              <span className="text-[var(--gold)] text-xs font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">Angie Carter</p>
              <p className="text-[10px] text-zinc-500 truncate">Ops Manager</p>
            </div>
            <Link href="/login" className="text-zinc-600 hover:text-zinc-400 transition-colors">
              <LogOut size={13} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-[var(--content-bg)]">
        {children}
      </main>
    </div>
  )
}
