#!/bin/bash
# Push DevToys to GitHub for JeffreyHamilton6399/devtoys
# Uses a classic PAT with `repo` scope. Token is read from env to avoid
# being persisted in git config or shell history.

set -euo pipefail

TOKEN="${GITHUB_TOKEN:?GITHUB_TOKEN must be set}"
OWNER="JeffreyHamilton6399"
REPO="devtoys"
DESCRIPTION="15 dev tools. One bookmark. Your data never leaves your browser. 100% client-side."

cd /home/z/my-project

# Configure git identity
git config user.email "jeffrey@example.com"
git config user.name "Jeffrey Hamilton"
git config init.defaultBranch main

# Init repo if needed
if [ ! -d .git ]; then
  git init
fi

# Make sure we're on main
git branch -M main 2>/dev/null || true

# Create the repo via API (idempotent: ignore 422 if already exists)
echo "→ Creating repository ${OWNER}/${REPO}..."
CREATE_RESPONSE=$(curl -s -m 15 -X POST \
  -H "Authorization: token ${TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"${REPO}\",\"description\":\"${DESCRIPTION}\",\"private\":false,\"has_issues\":true,\"has_wiki\":false}")
echo "$CREATE_RESPONSE" | head -10

# Stage and commit
git add -A
git commit -m "Initial commit: DevToys — 15 dev tools, one bookmark

- 12 client-side tools: JSON, Base64, URL, JWT, Regex, UUID,
  Timestamp, Hash, Color, Lorem, Cron, Diff
- Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui (New York)
- 100% client-side, no tracking, no accounts, no backend
- Mobile-first responsive layout (sidebar collapses to dropdown)
- Dark mode via next-themes
- Non-dismissable terms gate, localStorage-persisted settings

Author: Jeffrey Hamilton <https://github.com/JeffreyHamilton6399>" 2>&1 | tail -5 || echo "Nothing to commit or commit failed"

# Set remote (overwrite if exists) — using https URL with token in URL only
# temporarily for the push, then we'll unset to avoid leaving token in .git/config
git remote remove origin 2>/dev/null || true
git remote add origin "https://${OWNER}:${TOKEN}@github.com/${OWNER}/${REPO}.git"

# Push
echo "→ Pushing to github.com/${OWNER}/${REPO}..."
git push -u origin main 2>&1 | tail -10

# IMPORTANT: scrub token from .git/config
git remote set-url origin "https://github.com/${OWNER}/${REPO}.git"
echo "→ Token scrubbed from .git/config"
echo ""
echo "✓ Done. Repo: https://github.com/${OWNER}/${REPO}"
