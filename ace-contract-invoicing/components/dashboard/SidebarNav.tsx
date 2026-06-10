'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
}

export function SidebarNav({ links }: { links: NavLinkProps[] }) {
  const pathname = usePathname()
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {links.map(({ href, icon, label }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              active
                ? 'text-white bg-white/10'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="shrink-0">{icon}</span>
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
