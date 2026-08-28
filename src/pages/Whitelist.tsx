import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EntryForm } from '../components/whitelist/EntryForm'
import { Leaderboard } from '../components/whitelist/Leaderboard'
import { Success } from '../components/whitelist/Success'
import { TaskList } from '../components/whitelist/TaskList'
import { TwitterGate } from '../components/whitelist/TwitterGate'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  isLeaderboardPublic,
  submitEntry,
  verifySupabaseConnection,
  type WhitelistEntry,
} from '../lib/whitelistApi'

type Screen = 'twitter' | 'tasks' | 'form' | 'success' | 'leaderboard'
type DbStatus = 'checking' | 'ready' | 'offline'

const REF_STORAGE_KEY = 'luxora_ref'

export default function Whitelist() {
  const [screen, setScreen] = useState<Screen>('twitter')
  const [tasks, setTasks] = useState([false, false, false])
  const [twitter, setTwitter] = useState('')
  const [passwordHash, setPasswordHash] = useState('')
  const [entry, setEntry] = useState<WhitelistEntry | null>(null)
  const [referralCode, setReferralCode] = useState('')
  const [dbStatus, setDbStatus] = useState<DbStatus>(
    isSupabaseConfigured ? 'checking' : 'offline',
  )
  const [dbError, setDbError] = useState('')
  const [leaderboardPublic, setLeaderboardPublic] = useState(false)

  const checkDatabase = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setDbStatus('offline')
      setDbError('Database is not configured for this deployment.')
      return
    }

    setDbStatus('checking')
    const result = await verifySupabaseConnection()
    if (result.ok) {
      setDbStatus('ready')
      setDbError('')
      isLeaderboardPublic()
        .then(setLeaderboardPublic)
        .catch(() => setLeaderboardPublic(false))
    } else {
      setDbStatus('offline')
      setDbError(result.error ?? 'Database connection failed.')
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const refCode = params.get('ref')
    if (refCode) {
      localStorage.setItem(REF_STORAGE_KEY, refCode)
      setReferralCode(refCode)
    } else {
      const stored = localStorage.getItem(REF_STORAGE_KEY)
      if (stored) setReferralCode(stored)
    }
  }, [])

  useEffect(() => {
    checkDatabase()
  }, [checkDatabase])

  const allTasksDone = tasks.every(Boolean)
  const registrationOpen = dbStatus === 'ready'

  useEffect(() => {
    if (screen === 'tasks' && allTasksDone && registrationOpen) {
      const timer = setTimeout(() => setScreen('form'), 900)
      return () => clearTimeout(timer)
    }
  }, [screen, allTasksDone, registrationOpen])

  function handleTaskOpen(index: number) {
    setTasks((prev) => prev.map((done, i) => (i === index ? true : done)))
  }

  function handleNewUser(handle: string, hash: string) {
    setTwitter(handle)
    setPasswordHash(hash)
    setTasks([false, false, false])
    setScreen('tasks')
  }

  function handleExistingUser(existingEntry: WhitelistEntry | null) {
    if (existingEntry) {
      setEntry(existingEntry)
      setTwitter(existingEntry.twitter)
      setScreen('success')
    }
  }

  async function handleSubmit(data: {
    wallet: string
    replyLink: string
    referredBy?: string
  }) {
    if (dbStatus !== 'ready') {
      throw new Error('Registration is offline. Please wait and try again.')
    }

    const result = await submitEntry({
      twitter,
      wallet: data.wallet,
      replyLink: data.replyLink,
      referredBy: data.referredBy,
      passwordHash,
    })

    if (!result?.id || !result.twitter || !result.wallet) {
      throw new Error('Entry was not saved. Please try again.')
    }

    setEntry(result)
    setScreen('success')
  }

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      <div aria-hidden className="hero-backdrop absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(201,162,74,0.12),transparent_60%)]"
      />

      <header className="relative z-10 px-4 pt-4 md:px-8">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link
            to="/"
            className="font-display text-xl tracking-[0.08em] text-cream transition-colors hover:text-gold-bright md:text-2xl"
          >
            LUXORA
          </Link>
          {screen !== 'leaderboard' && screen !== 'success' && leaderboardPublic && (
            <button
              type="button"
              onClick={() => setScreen('leaderboard')}
              className="text-xs font-medium tracking-wide text-cream/70 transition-colors hover:text-cream md:text-sm"
            >
              Leaderboard
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-lg px-4 py-8 pb-16 md:px-6 md:py-12">
        {dbStatus !== 'ready' && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              dbStatus === 'checking'
                ? 'border-gold/30 bg-gold/10 text-gold-bright'
                : 'border-red-400/30 bg-red-500/10 text-red-300'
            }`}
          >
            {dbStatus === 'checking' ? (
              'Connecting to registration database…'
            ) : (
              <div className="space-y-2">
                <p className="font-medium">Registration is currently offline</p>
                <p className="text-red-200/80">{dbError}</p>
                <button
                  type="button"
                  onClick={checkDatabase}
                  className="rounded-full border border-red-300/40 px-4 py-1.5 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/10"
                >
                  Retry connection
                </button>
              </div>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {screen === 'twitter' && (
              <TwitterGate
                registrationOpen={registrationOpen}
                onNewUser={handleNewUser}
                onExistingUser={handleExistingUser}
              />
            )}

            {screen === 'tasks' && (
              <TaskList
                tasks={tasks}
                onTaskOpen={handleTaskOpen}
                registrationOpen={registrationOpen}
                allDone={allTasksDone}
              />
            )}

            {screen === 'form' && (
              <EntryForm
                twitter={twitter}
                initialReferral={referralCode}
                onSubmit={handleSubmit}
                onBack={() => setScreen('tasks')}
                registrationOpen={registrationOpen}
              />
            )}

            {screen === 'success' && entry && (
              <Success
                entry={entry}
                leaderboardPublic={leaderboardPublic}
                onViewLeaderboard={() => setScreen('leaderboard')}
              />
            )}

            {screen === 'leaderboard' && (
              <Leaderboard
                onEnterRaffle={() => setScreen(entry ? 'success' : 'twitter')}
                dbReady={registrationOpen}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
