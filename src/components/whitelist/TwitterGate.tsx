import { useState, type FormEvent } from 'react'
import { hashPassword, validatePassword } from '../../lib/password'
import { checkTwitterExists, getEntryWithPassword } from '../../lib/whitelistApi'
import { normalizeTwitter, validateTwitter } from '../../lib/whitelistValidation'
import type { WhitelistEntry } from '../../lib/whitelistApi'

const LUXORA_TWITTER = 'https://x.com/LuxoraRH'

type TwitterGateProps = {
  registrationOpen: boolean
  onNewUser: (twitter: string, passwordHash: string) => void
  onExistingUser: (entry: WhitelistEntry | null) => void
}

export function TwitterGate({ registrationOpen, onNewUser, onExistingUser }: TwitterGateProps) {
  const [twitter, setTwitter] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState<'twitter' | 'password' | 'unlock'>('twitter')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleTwitterSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const twitterErr = validateTwitter(twitter)
    if (twitterErr) {
      setError(twitterErr)
      return
    }

    if (!registrationOpen) {
      setError('Registration is offline. Please wait and try again.')
      return
    }

    setLoading(true)
    try {
      const handle = normalizeTwitter(twitter)
      const exists = await checkTwitterExists(handle)

      if (exists) {
        setStep('unlock')
      } else {
        setStep('password')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify Twitter handle')
    } finally {
      setLoading(false)
    }
  }

  async function handlePasswordSetup(e: FormEvent) {
    e.preventDefault()
    setError('')

    const passwordErr = validatePassword(password)
    if (passwordErr) {
      setError(passwordErr)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const handle = normalizeTwitter(twitter)
    const passwordHash = await hashPassword(password)
    onNewUser(handle, passwordHash)
  }

  async function handleUnlock(e: FormEvent) {
    e.preventDefault()
    setError('')

    const passwordErr = validatePassword(password)
    if (passwordErr) {
      setError(passwordErr)
      return
    }

    setLoading(true)
    try {
      const handle = normalizeTwitter(twitter)
      const entry = await getEntryWithPassword(handle, password)
      onExistingUser(entry)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify password')
    } finally {
      setLoading(false)
    }
  }

  function handleSkipUnlock() {
    onExistingUser(null)
  }

  const handle = normalizeTwitter(twitter)

  if (step === 'unlock') {
    return (
      <div className="space-y-6">
        <header className="text-center">
          <div className="text-4xl">🏮</div>
          <h1 className="mt-4 font-display text-2xl tracking-[0.1em] text-cream md:text-3xl">
            ALREADY ON THE LIST
          </h1>
          <p className="mt-3 text-cream/80">
            <span className="text-gold-bright">@{handle}</span> is already registered.
          </p>
          <p className="mt-2 text-sm text-cream/60">
            Wait for the winner announcement. Follow us on X for updates.
          </p>
        </header>

        <a
          href={LUXORA_TWITTER}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
        >
          Follow @LuxoraRH →
        </a>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-center text-sm text-cream/70">
            Enter your password to view your referral link and points.
          </p>
          <form onSubmit={handleUnlock} className="mt-4 space-y-4">
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-gold/50"
            />
            {error && (
              <p className="text-center text-xs text-red-300">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full border border-cream/20 px-6 py-3 text-sm font-medium text-cream transition-colors hover:border-cream/40 disabled:opacity-50"
            >
              {loading ? 'Verifying…' : 'Unlock my entry'}
            </button>
          </form>
        </div>

        <button
          type="button"
          onClick={handleSkipUnlock}
          className="w-full text-sm text-cream/50 transition-colors hover:text-cream/70"
        >
          Continue without unlocking
        </button>
      </div>
    )
  }

  if (step === 'password') {
    return (
      <div className="space-y-6">
        <header className="text-center">
          <h1 className="font-display text-3xl tracking-[0.12em] text-cream md:text-4xl">
            SECURE YOUR SPOT
          </h1>
          <p className="mt-2 text-sm text-cream/70">
            Set a password for <span className="text-gold-bright">@{handle}</span>
          </p>
          <p className="mt-2 text-xs text-cream/50">
            This protects your Twitter handle so no one else can claim it. You&apos;ll need this
            password to access your referral link later.
          </p>
        </header>

        <form onSubmit={handlePasswordSetup} className="space-y-4">
          <input
            type="password"
            placeholder="Create password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-gold/50"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-gold/50"
          />

          {error && (
            <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setStep('twitter')
                setPassword('')
                setConfirmPassword('')
                setError('')
              }}
              className="rounded-full border border-cream/20 px-6 py-3 text-sm font-medium text-cream/80 transition-colors hover:border-cream/40"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
            >
              Continue to Tasks →
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="font-display text-3xl tracking-[0.12em] text-cream md:text-4xl">
          LUXORA WHITELIST
        </h1>
        <p className="mt-2 text-sm text-cream/70 md:text-base">
          Get your spot. Own the light.
        </p>
      </header>

      <form onSubmit={handleTwitterSubmit} className="space-y-4">
        <div>
          <label htmlFor="twitter" className="mb-1.5 block text-sm font-medium text-cream/90">
            Twitter Username
          </label>
          <input
            id="twitter"
            type="text"
            placeholder="@yourhandle"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !registrationOpen}
          className="w-full rounded-full bg-gold px-6 py-3.5 text-sm font-semibold tracking-wide text-ink transition-all hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? 'Checking…' : 'Continue →'}
        </button>
      </form>
    </div>
  )
}
