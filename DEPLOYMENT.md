# Deploying Luxora — GitHub + Vercel (free)

The code is already deploy-ready. You just need to do these two steps yourself.
Everything here is free (hobby tier).

## Step 1 — Push the site to GitHub

1. Create an account at https://github.com if you don't have one.
2. Install the GitHub CLI (or use GitHub Desktop):
   - Terminal: `winget install GitHub.cli`
   - Or download GitHub Desktop: https://desktop.github.com
3. In a terminal inside this folder (`C:\Users\pc\Desktop\Luxora`):

   ```
   git init
   git add .
   git commit -m "Initial commit: Luxora"
   ```

4. Create the repo and push (this opens a browser to log in):
   - With GitHub CLI:
     ```
     gh auth login
     gh repo create luxora --private --source . --push
     ```
   - Or on the web: create a new repo named `luxora` (private recommended),
     then run:
     ```
     git remote add origin https://github.com/YOUR_USERNAME/luxora.git
     git branch -M main
     git push -u origin main
     ```

Notes:
- `.gitignore` already excludes `node_modules`, `dist`, and the duplicate
  `assets/` folder. Only the real site files (including `public/assets/`) get pushed.
- `public/assets/` (the site images, ~275 MB) is pushed as-is. Upload takes a
  few minutes. Later, when we compress the images, the old copies stay in git
  history — that's fine for now.
- If a file ever exceeds 100 MB, GitHub rejects the push — ours are ~5 MB each.

## Step 2 — Deploy with Vercel

1. Create an account at https://vercel.com (sign in with your GitHub account).
2. Click **Add New → Project**.
3. Pick the `luxora` repo you just pushed. (If it doesn't show up, click
   "Adjust GitHub App Permissions" and allow access.)
4. Vercel auto-detects everything:
   - Framework preset: **Vite** (reads `vercel.json` automatically)
   - Build command: `npm run build`
   - Output directory: `dist`
   - No need to change any settings.
5. Click **Deploy**. After ~1 minute you get a URL like
   `https://luxora-xxxx.vercel.app`.

## Step 3 — Share with your team

- The link automatically works for anyone — no login needed, even though the
  GitHub repo is private.
- Every time you `git push`, Vercel redeploys the site automatically.
- You can set a custom domain later under **Settings → Domains** (a
  `yourname.com` domain or free `*.vercel.app` subdomains).

## Useful commands

```
npm run dev      # local development at http://localhost:5173
npm run build    # check the production build works (do this before pushing)
```