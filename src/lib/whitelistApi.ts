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

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < retries && isRetryableError(error)) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
        continue
      }
      throw error
    }
  }
  throw lastError
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

export async function verifySupabaseConnection(): Promise<ConnectionStatus> {
  if (!supabase) {
    return {
      ok: false,
      error: 'Database is not configured for this deployment.',
    }
  }

  try {
    const { error } = await supabase
      .from('whitelist_entries')
      .select('id', { count: 'exact', head: true })

    if (error) {
      return { ok: false, error: mapSupabaseError(error) }
    }

    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Database connection failed',
    }
  }
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

    if (referredBy) {
      const { data: referrer, error: referrerError } = await client
        .from('whitelist_entries')
        .select('id, points')
        .eq('referral_code', referredBy)
        .maybeSingle()

      if (!referrerError && referrer) {
        const { error: updateError } = await client
          .from('whitelist_entries')
          .update({ points: referrer.points + 50 })
          .eq('referral_code', referredBy)

        if (updateError) {
          console.error('Referral points update failed:', updateError.message)
        }
      }
    }

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
