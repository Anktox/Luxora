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

export async function submitEntry({
  twitter,
  wallet,
  replyLink,
  referredBy,
}: {
  twitter: string
  wallet: string
  replyLink: string
  referredBy?: string | null
}): Promise<WhitelistEntry> {
  const { data: existing } = await supabase
    .from('whitelist_entries')
    .select('id, twitter, wallet')
    .or(`twitter.eq.${twitter},wallet.eq.${wallet}`)

  if (existing && existing.length > 0) {
    const match = existing[0]
    if (match.twitter === twitter) {
      throw new Error('Already registered')
    }
    throw new Error('Wallet already registered')
  }

  const referralCode = generateReferralCode(twitter)

  const { data, error } = await supabase
    .from('whitelist_entries')
    .insert({
      twitter,
      wallet,
      reply_link: replyLink,
      points: 100,
      referral_code: referralCode,
      referred_by: referredBy || null,
    })
    .select()

  if (error) throw error
  if (!data?.[0]) throw new Error('Failed to create entry')

  if (referredBy) {
    const { data: referrer } = await supabase
      .from('whitelist_entries')
      .select('id, points')
      .eq('referral_code', referredBy)
      .single()

    if (referrer) {
      await supabase
        .from('whitelist_entries')
        .update({ points: referrer.points + 50 })
        .eq('referral_code', referredBy)
    }
  }

  return data[0] as WhitelistEntry
}

export async function getLeaderboard(limit = 50, offset = 0): Promise<LeaderboardRow[]> {
  const { data, error } = await supabase
    .from('whitelist_entries')
    .select('twitter, points, created_at')
    .order('points', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return (data ?? []) as LeaderboardRow[]
}

export async function getTotalCount(): Promise<number> {
  const { count, error } = await supabase
    .from('whitelist_entries')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  return count ?? 0
}
