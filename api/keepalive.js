import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function loadEnvFile(name) {
  try {
    const content = readFileSync(join(process.cwd(), name), 'utf8')
    const vars = {}
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      vars[trimmed.slice(0, eq)] = trimmed.slice(eq + 1)
    }
    return vars
  } catch {
    return {}
  }
}

// UptimeRobot / external pings — reads .env.production when Vercel env vars aren't set.
export default async function handler(_req, res) {
  const fileEnv = loadEnvFile('.env.production')
  const url =
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    fileEnv.VITE_SUPABASE_URL
  const key =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    fileEnv.VITE_SUPABASE_ANON_KEY

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
