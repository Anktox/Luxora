import { useState, type FormEvent } from 'react'

type EntryFormProps = {
  initialReferral?: string
  onSubmit: (data: {
    twitter: string
    wallet: string
    replyLink: string
    referredBy?: string
  }) => Promise<void>
  onBack: () => void
  registrationOpen: boolean
}

function validateTwitter(value: string): string | null {
  const cleaned = value.replace('@', '').trim().toLowerCase()
  if (!cleaned) return 'Twitter username is required'
  if (!/^[a-z0-9_]{1,15}$/.test(cleaned)) return 'Invalid Twitter username'
  return null
}

function validateWallet(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Wallet address is required'
  if (!trimmed.startsWith('0x') || trimmed.length !== 42) {
    return 'Must be a valid EVM address (0x + 40 hex chars)'
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return 'Invalid wallet address format'
  return null
}

function validateReplyLink(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Reply link is required'
  if (!trimmed.includes('x.com') && !trimmed.includes('twitter.com')) {
    return 'Must be a valid X/Twitter link'
  }
  return null
}

export function EntryForm({
  initialReferral = '',
  onSubmit,
  onBack,
  registrationOpen,
}: EntryFormProps) {
  const [twitter, setTwitter] = useState('')
  const [wallet, setWallet] = useState('')
  const [replyLink, setReplyLink] = useState('')
  const [referral, setReferral] = useState(initialReferral)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError('')

    const nextErrors: Record<string, string> = {}
    const twitterErr = validateTwitter(twitter)
    const walletErr = validateWallet(wallet)
    const replyErr = validateReplyLink(replyLink)

    if (twitterErr) nextErrors.twitter = twitterErr
    if (walletErr) nextErrors.wallet = walletErr
    if (replyErr) nextErrors.replyLink = replyErr

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    if (!registrationOpen) {
      setSubmitError('Registration is offline. Please wait and try again.')
      return
    }

    setErrors({})
    setLoading(true)

    try {
      await onSubmit({
        twitter: twitter.replace('@', '').trim().toLowerCase(),
        wallet: wallet.trim(),
        replyLink: replyLink.trim(),
        referredBy: referral.trim() || undefined,
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="font-display text-3xl tracking-[0.12em] text-cream md:text-4xl">
          ALMOST THERE
        </h1>
        <p className="mt-2 text-sm text-cream/70">Complete your whitelist entry</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          label="Twitter Username"
          id="twitter"
          placeholder="@yourhandle"
          value={twitter}
          onChange={setTwitter}
          error={errors.twitter}
        />

        <Field
          label="EVM Wallet Address"
          id="wallet"
          placeholder="0x..."
          value={wallet}
          onChange={setWallet}
          error={errors.wallet}
        />

        <Field
          label="Your Reply Link"
          id="replyLink"
          placeholder="https://x.com/..."
          value={replyLink}
          onChange={setReplyLink}
          error={errors.replyLink}
          hint="Paste the link to your reply on the pinned post"
        />

        <Field
          label="Referral Code (optional)"
          id="referral"
          placeholder="LUXORA-XXXX-XXXX"
          value={referral}
          onChange={setReferral}
        />

        {submitError && (
          <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {submitError}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-cream/20 px-6 py-3 text-sm font-medium text-cream/80 transition-colors hover:border-cream/40"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={loading || !registrationOpen}
            className="flex-1 rounded-full bg-gold px-6 py-3 text-sm font-semibold tracking-wide text-ink transition-all hover:bg-gold-bright disabled:opacity-50"
          >
            {loading ? 'Saving to database…' : registrationOpen ? 'Submit Entry →' : 'Registration offline'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  id,
  placeholder,
  value,
  onChange,
  error,
  hint,
}: {
  label: string
  id: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  error?: string
  hint?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-cream/90">
        {label}
      </label>
      {hint && <p className="mb-2 text-xs text-cream/50">{hint}</p>}
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
      />
      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  )
}
