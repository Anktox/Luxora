// Pings Supabase every 5 min via Vercel Cron to prevent free-tier cold pauses.
export default async function handler(_req, res) {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    return res.status(500).json({ ok: false, error: 'Missing Supabase env vars' })
  }

  try {
    const response = await fetch(
      `${url}/rest/v1/whitelist_entries?select=id&limit=1`,
      {
        method: 'HEAD',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      },
    )

    return res.status(200).json({ ok: response.ok, status: response.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Keepalive failed'
    return res.status(500).json({ ok: false, error: message })
  }
}
