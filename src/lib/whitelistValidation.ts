export function normalizeTwitter(value: string): string {
  return value.replace('@', '').trim().toLowerCase()
}

export function validateTwitter(value: string): string | null {
  const cleaned = normalizeTwitter(value)
  if (!cleaned) return 'Twitter username is required'
  if (!/^[a-z0-9_]{1,15}$/.test(cleaned)) return 'Invalid Twitter username'
  return null
}

export function extractTwitterFromReplyUrl(url: string): string | null {
  try {
    const parsed = new URL(url.trim())
    const host = parsed.hostname.replace('www.', '')
    if (!host.includes('x.com') && !host.includes('twitter.com')) return null

    const parts = parsed.pathname.split('/').filter(Boolean)
    if (parts.length === 0) return null

    const username = parts[0].toLowerCase()
    if (username === 'i' || username === 'intent' || username === 'home') return null
    if (!/^[a-z0-9_]{1,15}$/.test(username)) return null

    return username
  } catch {
    return null
  }
}

export function validateReplyLink(value: string, twitter: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Reply link is required'
  if (!trimmed.includes('x.com') && !trimmed.includes('twitter.com')) {
    return 'Must be a valid X/Twitter link'
  }

  const replyAuthor = extractTwitterFromReplyUrl(trimmed)
  if (!replyAuthor) return 'Could not read Twitter username from that link'
  if (replyAuthor !== normalizeTwitter(twitter)) {
    return 'Reply link must be from your own Twitter account'
  }

  return null
}

export function validateWallet(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Wallet address is required'
  if (!trimmed.startsWith('0x') || trimmed.length !== 42) {
    return 'Must be a valid EVM address (0x + 40 hex chars)'
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return 'Invalid wallet address format'
  return null
}
