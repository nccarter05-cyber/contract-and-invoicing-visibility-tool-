'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Demo: simulate sending magic link
    setSent(true)
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-[var(--content-bg)] px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black mb-4">
            <span className="text-[var(--gold)] font-bold text-lg">AC</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">ACE Creatives</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Contract & Invoicing</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--border)] bg-white shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">Check your email</h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                We sent a magic link to <strong>{email}</strong>
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
              >
                Use a different email
              </button>
              <div className="mt-4 border-t border-[var(--border)] pt-4">
                <Link
                  href="/"
                  className="text-sm font-medium text-[var(--gold)] hover:text-[var(--gold-muted)] transition-colors"
                >
                  Continue to demo →
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">Sign in</h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Enter your email to receive a secure magic link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@acecreatives.com"
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-black text-[var(--gold)] py-2.5 text-sm font-semibold hover:bg-zinc-800 transition-colors"
                >
                  Send Magic Link
                </button>
              </form>
              <div className="mt-5 border-t border-[var(--border)] pt-4">
                <Link
                  href="/"
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Skip to demo →
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          Invite-only access · Powered by ACE Creatives
        </p>
      </div>
    </div>
  )
}
