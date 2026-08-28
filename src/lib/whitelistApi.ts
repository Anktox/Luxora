import { hashPassword } from './password'
import { generateReferralCode } from './generateCode'
import { supabase } from './supabase'

export type WhitelistEntry = {
  id: string
  twitter: string
  wallet: string
  reply_link: string
  points: number
  referral_code: string
  referred_by: string | null
  created_at: string
}

export type LeaderboardRow = {
  twitter: string
  points: number
  created_at: string
}

export const LEADERBOARD_REVEAL_MIN = 1000

export type ConnectionStatus = {
  ok: boolean
  error?: string
}

function getClient() {
  if (!supabase) {
    throw new Error(
      'Registration is offline — database is not configured. Contact support.',
    )
  }
  return supabase
}

function mapSupabaseError(error: { code?: string; message: string }): string {
  if (error.code === '23505') return 'Already registered'
  if (error.code === 'PGRST301' || error.code === 'PGRST116') {
    return 'Database connection failed. Please try again.'
  }
  return error.message || 'Failed to save your entry. Please try again.'
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const message = error.message.toLowerCase()
  return (
    message.includes('fetch') ||
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('connection')
  )
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelayMs = 1500,
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < retries && isRetryableError(error)) {
        await new Promise((resolve) => setTimeout(resolve, baseDelayMs * (attempt + 1)))
        continue
      }
      throw error
    }
  }
  throw lastError
}

async function pingSupabase(timeoutMs = 6000): Promise<ConnectionStatus> {
  if (!supabase) {
    return {
      ok: false,
      error: 'Database is not configured for this deployment.',
    }
  }

  try {
    const result = await Promise.race([
      supabase
        .from('whitelist_entries')
        .select('id', { count: 'exact', head: true })
        .then(({ error }) => (error ? { ok: false as const, error: mapSupabaseError(error) } : { ok: true as const })),
      new Promise<ConnectionStatus>((resolve) =>
        setTimeout(() => resolve({ ok: false, error: 'Connection timed out' }), timeoutMs),
      ),
    ])
    return result
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Database connection failed',
    }
  }
}

function assertValidEntry(entry: unknown): asserts entry is WhitelistEntry {
  if (
    !entry ||
    typeof entry !== 'object' ||
    !('id' in entry) ||
    !('twitter' in entry) ||
    !('wallet' in entry) ||
    !('referral_code' in entry)
  ) {
    throw new Error('Entry was not saved correctly. Please try again.')
  }
}

/** Quick background ping on page load. */
export async function verifySupabaseConnection(): Promise<ConnectionStatus> {
  return pingSupabase(6000)
}

/** Full retry for submit — DB may need time to wake on free tier. */
export async function warmSupabaseConnection(): Promise<ConnectionStatus> {
  const attempts = 3
  const delayMs = 1200

  for (let attempt = 0; attempt < attempts; attempt++) {
    const result = await pingSupabase(8000)
    if (result.ok) return result

    if (attempt < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)))
    } else {
      return {
        ok: false,
        error: result.error ?? 'Database is waking up. Please try again.',
      }
    }
  }

  return { ok: false, error: 'Database connection failed.' }
}

/** Fire server keepalive + client ping without blocking UI. */
export function startBackgroundWarmup(onReady: () => void, onOffline: (msg: string) => void) {
  fetch('/api/keepalive').catch(() => {})

  verifySupabaseConnection().then((result) => {
    if (result.ok) {
      onReady()
      return
    }

    warmSupabaseConnection().then((retry) => {
      if (retry.ok) onReady()
      else onOffline(retry.error ?? 'Database connection failed.')
    })
  })
}

export async function checkTwitterExists(twitter: string): Promise<boolean> {
  const client = getClient()
  const { data, error } = await client
    .from('whitelist_entries')
    .select('id')
    .eq('twitter', twitter)
    .maybeSingle()

  if (error) throw new Error(mapSupabaseError(error))
  return Boolean(data)
}

export async function getEntryWithPassword(
  twitter: string,
  password: string,
): Promise<WhitelistEntry | null> {
  const client = getClient()
  const passwordHash = await hashPassword(password)

  const { data, error } = await client
    .from('whitelist_entries')
    .select('id, twitter, wallet, reply_link, points, referral_code, referred_by, created_at')
    .eq('twitter', twitter)
    .eq('password_hash', passwordHash)
    .maybeSingle()

  if (error) throw new Error(mapSupabaseError(error))
  return (data as WhitelistEntry | null) ?? null
}

export async function submitEntry({
  twitter,
  wallet,
  replyLink,
  referredBy,
  passwordHash,
}: {
  twitter: string
  wallet: string
  replyLink: string
  referredBy?: string | null
  passwordHash: string
}): Promise<WhitelistEntry> {
  return withRetry(async () => {
    const client = getClient()

    const { data: twitterMatch, error: twitterError } = await client
      .from('whitelist_entries')
      .select('id')
      .eq('twitter', twitter)
      .maybeSingle()

    if (twitterError) throw new Error(mapSupabaseError(twitterError))
    if (twitterMatch) throw new Error('Already registered')

    const { data: walletMatch, error: walletError } = await client
      .from('whitelist_entries')
      .select('id')
      .eq('wallet', wallet)
      .maybeSingle()

    if (walletError) throw new Error(mapSupabaseError(walletError))
    if (walletMatch) throw new Error('Wallet already registered')

    const referralCode = generateReferralCode(twitter)

    const { data, error } = await client
      .from('whitelist_entries')
      .insert({
        twitter,
        wallet,
        reply_link: replyLink,
        points: 100,
        referral_code: referralCode,
        referred_by: referredBy || null,
        password_hash: passwordHash,
      })
      .select()
      .single()

    if (error) throw new Error(mapSupabaseError(error))

    const entry = data
    assertValidEntry(entry)

    // Referral +50 points handled by database trigger (on_referral_signup)

    return entry
  })
}

export async function getLeaderboard(limit = 50, offset = 0): Promise<LeaderboardRow[]> {
  const client = getClient()
  const { data, error } = await client
    .from('whitelist_entries')
    .select('twitter, points, created_at')
    .order('points', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw new Error(mapSupabaseError(error))
  return (data ?? []) as LeaderboardRow[]
}

export async function getTotalCount(): Promise<number> {
  const client = getClient()
  const { count, error } = await client
    .from('whitelist_entries')
    .select('*', { count: 'exact', head: true })

  if (error) throw new Error(mapSupabaseError(error))
  return count ?? 0
}

export async function isLeaderboardPublic(): Promise<boolean> {
  const count = await getTotalCount()
  return count > LEADERBOARD_REVEAL_MIN
}
