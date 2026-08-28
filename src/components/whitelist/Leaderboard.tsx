import { useCallback, useEffect, useState } from 'react'
import {
  getLeaderboard,
  getTotalCount,
  isLeaderboardPublic,
  type LeaderboardRow,
} from '../../lib/whitelistApi'

const PAGE_SIZE = 50
const REFRESH_MS = 60_000

type LeaderboardProps = {
  onEnterRaffle: () => void
  dbReady: boolean
}

function LeaderboardHidden({ onEnterRaffle }: { onEnterRaffle: () => void }) {
  return (
    <div className="space-y-6 text-center">
      <div className="text-5xl">🏮</div>
      <header>
        <h1 className="font-display text-3xl tracking-[0.12em] text-cream md:text-4xl">
          LEADERBOARD
        </h1>
        <p className="mt-4 text-sm text-cream/70 md:text-base">
          Entries will be revealed soon.
        </p>
        <p className="mt-2 text-xs text-cream/50">
          Wait and check our{' '}
          <a
            href="https://x.com/LuxoraRH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-bright underline decoration-gold/40 underline-offset-2 hover:text-gold"
          >
            Twitter
          </a>{' '}
          for the announcement.
        </p>
      </header>

      <button
        type="button"
        onClick={onEnterRaffle}
        className="w-full rounded-full bg-gold px-6 py-3.5 text-sm font-semibold tracking-wide text-ink transition-all hover:bg-gold-bright"
      >
        Enter Raffle →
      </button>
    </div>
  )
}

export function Leaderboard({ onEnterRaffle, dbReady }: LeaderboardProps) {
  const [isPublic, setIsPublic] = useState<boolean | null>(null)
  const [rows, setRows] = useState<LeaderboardRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  const checkVisibility = useCallback(async () => {
    if (!dbReady) {
      setIsPublic(false)
      return false
    }
    try {
      const visible = await isLeaderboardPublic()
      setIsPublic(visible)
      return visible
    } catch {
      setIsPublic(false)
      return false
    }
  }, [dbReady])

  const fetchData = useCallback(async (offset = 0, append = false) => {
    try {
      const [leaderboard, count] = await Promise.all([
        getLeaderboard(PAGE_SIZE, offset),
        offset === 0 ? getTotalCount() : Promise.resolve(null),
      ])

      setRows((prev) => (append ? [...prev, ...leaderboard] : leaderboard))
      if (count !== null) setTotal(count)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard')
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const visible = await checkVisibility()
      if (cancelled) return

      if (visible) {
        await fetchData(0)
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [checkVisibility, fetchData])

  useEffect(() => {
    if (!isPublic || !dbReady) return

    const interval = setInterval(() => fetchData(0), REFRESH_MS)
    return () => clearInterval(interval)
  }, [isPublic, dbReady, fetchData])

  async function loadMore() {
    setLoadingMore(true)
    await fetchData(rows.length, true)
    setLoadingMore(false)
  }

  if (loading || isPublic === null) {
    return (
      <div className="py-16 text-center text-sm text-cream/50">Loading…</div>
    )
  }

  if (!isPublic) {
    return <LeaderboardHidden onEnterRaffle={onEnterRaffle} />
  }

  const hasMore = rows.length < total

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="font-display text-3xl tracking-[0.12em] text-cream md:text-4xl">
          LEADERBOARD
        </h1>
        <p className="mt-2 text-sm text-cream/70">Top 1000 get GTD Whitelist</p>
      </header>

      {error && (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-[3rem_1fr_5rem] gap-2 border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gold">
          <span>Rank</span>
          <span>Twitter</span>
          <span className="text-right">Points</span>
        </div>

        {rows.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-cream/50">
            No entries yet.
          </div>
        ) : (
          <ul>
            {rows.map((row, index) => (
              <li
                key={`${row.twitter}-${index}`}
                className="grid grid-cols-[3rem_1fr_5rem] gap-2 border-b border-white/5 px-4 py-3 text-sm last:border-0"
              >
                <span className="font-medium text-cream/50">#{index + 1}</span>
                <span className="truncate text-cream">@{row.twitter}</span>
                <span className="text-right font-semibold text-gold">{row.points}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="w-full rounded-full border border-cream/20 px-6 py-3 text-sm font-medium text-cream transition-colors hover:border-cream/40 disabled:opacity-50"
        >
          {loadingMore ? 'Loading…' : 'Load More'}
        </button>
      )}

      <p className="text-center text-sm text-cream/50">
        Total Entries: <span className="font-semibold text-cream">{total.toLocaleString()}</span>
      </p>

      <button
        type="button"
        onClick={onEnterRaffle}
        className="w-full rounded-full bg-gold px-6 py-3.5 text-sm font-semibold tracking-wide text-ink transition-all hover:bg-gold-bright"
      >
        Enter Raffle →
      </button>
    </div>
  )
}
