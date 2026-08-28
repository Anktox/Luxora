export function generateReferralCode(twitter: string): string {
  const clean = twitter.replace('@', '').toUpperCase().slice(0, 6)
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `LUXORA-${clean}-${rand}`
}
