const FOLLOW_URL = 'https://x.com/LuxoraRH'
const POST_URL = 'https://x.com/LuxoraRH/status/2090145097346437402?s=20'

type TaskListProps = {
  tasks: boolean[]
  onTaskOpen: (index: number) => void
  registrationOpen: boolean
  allDone: boolean
}

const taskDefs = [
  {
    title: 'Follow @LuxoraRH',
    description: 'Follow the official Luxora account on X.',
    url: FOLLOW_URL,
    buttonLabel: 'Open Twitter →',
  },
  {
    title: 'Like & Retweet',
    description: 'Like and retweet the pinned announcement post.',
    url: POST_URL,
    buttonLabel: 'Open Post →',
  },
  {
    title: 'Reply with your wallet',
    description: 'Reply on the pinned post with your EVM wallet address.',
    url: POST_URL,
    buttonLabel: 'Open Post →',
  },
]

export function TaskList({ tasks, onTaskOpen, registrationOpen, allDone }: TaskListProps) {
  function openTask(index: number, url: string) {
    onTaskOpen(index)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="font-display text-3xl tracking-[0.12em] text-cream md:text-4xl">
          COMPLETE THE TASKS
        </h1>
        <p className="mt-2 text-sm text-cream/70 md:text-base">
          Open each link — tasks complete automatically.
        </p>
      </header>

      <div className="space-y-4">
        {taskDefs.map((task, index) => (
          <div
            key={task.title}
            className={`glass-strong rounded-2xl border p-5 backdrop-blur-md transition-colors ${
              tasks[index]
                ? 'border-gold/30 bg-gold/5'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-widest text-gold">
                  Task {index + 1}
                </p>
                <h2 className="mt-1 font-display text-xl text-cream">{task.title}</h2>
                <p className="mt-1 text-sm text-cream/60">{task.description}</p>
              </div>
              {tasks[index] && (
                <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-gold-bright">
                  ✓ Done
                </span>
              )}
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => openTask(index, task.url)}
                disabled={!registrationOpen}
                className="inline-flex items-center justify-center rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-medium text-gold-bright transition-colors hover:bg-gold/20 disabled:opacity-40"
              >
                {task.buttonLabel}
              </button>
            </div>
          </div>
        ))}
      </div>

      {allDone && registrationOpen && (
        <p className="text-center text-sm text-gold-bright animate-pulse">
          All tasks complete — taking you to the form…
        </p>
      )}

      {!allDone && (
        <p className="text-center text-xs text-cream/40">
          {tasks.filter(Boolean).length} of {taskDefs.length} tasks completed
        </p>
      )}
    </div>
  )
}
