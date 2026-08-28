const FOLLOW_URL = 'https://x.com/LuxoraRH'
const POST_URL = 'https://x.com/LuxoraRH/status/2090145097346437402?s=20'

type TaskListProps = {
  tasks: boolean[]
  onToggle: (index: number) => void
  onContinue: () => void
  registrationOpen: boolean
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

export function TaskList({ tasks, onToggle, onContinue, registrationOpen }: TaskListProps) {
  const allDone = tasks.every(Boolean)
  const canContinue = allDone && registrationOpen

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

      <div className="space-y-4">
        {taskDefs.map((task, index) => (
          <div
            key={task.title}
            className="glass-strong rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-widest text-gold">
                  Task {index + 1}
                </p>
                <h2 className="mt-1 font-display text-xl text-cream">{task.title}</h2>
                <p className="mt-1 text-sm text-cream/60">{task.description}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-medium text-gold-bright transition-colors hover:bg-gold/20"
              >
                {task.buttonLabel}
              </a>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-cream/80">
                <input
                  type="checkbox"
                  checked={tasks[index]}
                  onChange={() => onToggle(index)}
                  className="size-4 rounded border-cream/30 accent-gold"
                />
                Mark as done
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full rounded-full bg-gold px-6 py-3.5 text-sm font-semibold tracking-wide text-ink transition-all hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
      >
        {registrationOpen ? 'Continue to Form →' : 'Registration offline'}
      </button>
    </div>
  )
}
