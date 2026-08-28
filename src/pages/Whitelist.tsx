import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EntryForm } from '../components/whitelist/EntryForm'
import { Leaderboard } from '../components/whitelist/Leaderboard'
import { Success } from '../components/whitelist/Success'
import { TaskList } from '../components/whitelist/TaskList'
import { submitEntry, type WhitelistEntry } from '../lib/whitelistApi'

type Screen = 'tasks' | 'form' | 'success' | 'leaderboard'

const REF_STORAGE_KEY = 'luxora_ref'

export default function Whitelist() {
  const [screen, setScreen] = useState<Screen>('tasks')
  const [tasks, setTasks] = useState([false, false, false])
  const [entry, setEntry] = useState<WhitelistEntry | null>(null)
  const [referralCode, setReferralCode] = useState('')

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

  function toggleTask(index: number) {
    setTasks((prev) => prev.map((done, i) => (i === index ? !done : done)))
  }

  async function handleSubmit(data: {
    twitter: string
    wallet: string
    replyLink: string
    referredBy?: string
  }) {
    const result = await submitEntry(data)
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
          {screen !== 'leaderboard' && screen !== 'success' && (
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
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {screen === 'tasks' && (
              <TaskList
                tasks={tasks}
                onToggle={toggleTask}
                onContinue={() => setScreen('form')}
              />
            )}

            {screen === 'form' && (
              <EntryForm
                initialReferral={referralCode}
                onSubmit={handleSubmit}
                onBack={() => setScreen('tasks')}
              />
            )}

            {screen === 'success' && entry && (
              <Success entry={entry} onViewLeaderboard={() => setScreen('leaderboard')} />
            )}

            {screen === 'leaderboard' && (
              <Leaderboard onEnterRaffle={() => setScreen(entry ? 'success' : 'tasks')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
