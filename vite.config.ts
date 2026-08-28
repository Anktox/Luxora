import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  if (mode === 'production') {
    const missing = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'].filter(
      (key) => !env[key]?.trim(),
    )
    if (missing.length > 0) {
      throw new Error(
        `Whitelist requires Supabase env vars at build time: ${missing.join(', ')}. ` +
          'Add them in Vercel project settings before deploying.',
      )
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
    },
    build: {
      target: 'es2020',
      cssMinify: true,
      modulePreload: true,
    },
  }
})
