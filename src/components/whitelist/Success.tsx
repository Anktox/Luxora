import { useState } from 'react'
import type { WhitelistEntry } from '../../lib/whitelistApi'

const REFERRAL_BASE = 'https://luxorarh.xyz/whitelist?ref='

type SuccessProps = {
  entry: WhitelistEntry
  leaderboardPublic: boolean
  onViewLeaderboard: () => void
}

function shortenWallet(wallet: string): string {
  if (wallet.length <= 10) return wallet
  return `${wallet.slice(0, 6)}...${wallet.slice(-3)}`
}

export function Success({ entry, leaderboardPublic, onViewLeaderboard }: SuccessProps) {
  const [copied, setCopied] = useState(false)
  const referralLink = `${REFERRAL_BASE}${entry.referral_code}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <div className="space-y-6 text-center">
      <div className="text-5xl">🏮</div>

      <header>
        <h1 className="font-display text-2xl tracking-[0.1em] text-cream md:text-3xl">
          YOU ARE IN THE RAFFLE
        </h1>
        <p className="mt-3 text-cream/80">
          Welcome, <span className="text-gold-bright">@{entry.twitter}</span>
        </p>
        <p className="mt-1 font-mono text-sm text-cream/60">
          Wallet: {shortenWallet(entry.wallet)}
        </p>
        <p className="mt-2 text-lg font-semibold text-gold">
          Points: {entry.points}
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
        <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gold">
          How to Win
        </h2>
        <ul className="space-y-4 text-sm text-cream/80">
          <li className="flex gap-3">
            <span className="text-lg">🥇</span>
            <div>
              <p className="font-medium text-cream">Top 1000 by points</p>
              <p className="text-cream/60">Guaranteed Whitelist</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">🎲</span>
            <div>
              <p className="font-medium text-cream">Lucky Draw</p>
              <p className="text-cream/60">1000 random winners from all participants</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">👑</span>
            <div>
              <p className="font-medium text-cream">Top 10</p>
              <p className="text-cream/60">Free NFT — no mint needed</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-gold/20 bg-gold/5 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gold">
          Your Referral Link
        </h2>
        <p className="mt-2 break-all font-mono text-xs text-cream/70 md:text-sm">
          {referralLink}
        </p>
        <button
          type="button"
          onClick={copyLink}
          className="mt-4 w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
        >
          {copied ? '✓ Copied!' : 'Copy Link 📋'}
        </button>
        <p className="mt-3 text-xs text-cream/50">Each referral = +50 points</p>
      </div>

      {leaderboardPublic && (
        <button
          type="button"
          onClick={onViewLeaderboard}
          className="w-full rounded-full border border-cream/20 px-6 py-3 text-sm font-medium text-cream transition-colors hover:border-cream/40"
        >
          View Leaderboard →
        </button>
      )}
    </div>
  )
}
