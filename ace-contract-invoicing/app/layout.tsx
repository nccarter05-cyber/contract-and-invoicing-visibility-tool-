import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ACE Creatives — Contract & Invoicing',
  description: 'Contract and invoicing visibility tool for ACE Creatives ops.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
