# DevToys

**40 dev tools. One bookmark. Your data never leaves your browser.**

A clean, fast, 100% client-side developer toolbox. No accounts, no tracking, no
uploads, no ads. Just paste, click, copy.

Live demo: _add your Vercel URL here after deploy_

## Tools

| # | Tool | What it does |
|---|------|--------------|
| 1 | **JSON Formatter** | Pretty-print, minify, and validate JSON with exact error positions |
| 2 | **Base64** | Encode/decode text — UTF-8 safe via `TextEncoder` / `TextDecoder` |
| 3 | **URL Encode/Decode** | `encodeURIComponent` / `decodeURIComponent` with one-click swap |
| 4 | **JWT Decoder** | Decodes header, payload, and signature; warns on expired tokens |
| 5 | **Regex Tester** | Test regex with `g`/`i`/`m`/`s` flags, highlighted matches, capture groups |
| 6 | **UUID Generator** | Generate v4 UUIDs via `crypto.randomUUID()` — 1, 10, 50, or 100 at a time |
| 7 | **Timestamp Converter** | Convert Unix timestamp ↔ human date, both directions, with relative time |
| 8 | **Hash Generator** | MD5 (local impl) + SHA-1 / SHA-256 / SHA-512 via Web Crypto API |
| 9 | **Color Converter** | HEX ↔ RGB ↔ HSL with live swatch and CSS variable output |
| 10 | **Lorem Ipsum** | Generate paragraphs, sentences, or words of classic placeholder text |
| 11 | **Cron Parser** | Parse 5-field cron expressions into human-readable schedules + next 5 runs |
| 12 | **Diff Checker** | Line-by-line or word-by-word diff with additions/removals highlighted |
| 13 | **Markdown Preview** | Paste Markdown → see rendered HTML live (headings, lists, code, tables) |
| 14 | **JSON → TypeScript** | Paste any JSON → auto-generated TS interfaces (nested, arrays, optional) |
| 15 | **Password Generator** | Length slider, char-set toggles, strength meter, batch x10/x50, crypto-secure |
| 16 | **Case Converter** | camelCase / PascalCase / snake_case / kebab-case / SCREAMING_SNAKE / etc. |
| 17 | **HTML Entities** | Encode/decode HTML entities — named (`&amp;`) + numeric (`&#39;`) + 30+ extended |
| 18 | **Base Converter** | bin / oct / dec / hex / base36 / base58 / base64 — BigInt-safe, live updates |
| 19 | **Text Stats** | Word/char/line/sentence/paragraph count + reading/speaking time + longest word |
| 20 | **Slug Generator** | Text → URL-safe slug, Unicode-aware (café → cafe, naïve → naive) |
| 21 | **URL Parser** | Paste a URL → see protocol/host/port/path/query-params/hash broken out into a table |
| 22 | **HTTP Status Codes** | Searchable reference of 62 status codes (1xx–5xx) with meaning + category filter |
| 23 | **String Escape** | Escape/unescape for JSON, regex, HTML, SQL, and shell — one tool, 5 formats |
| 24 | **Image → Base64** | Drag/drop/paste an image → data URI + CSS + HTML snippets |
| 25 | **JSON ↔ CSV** | Convert an array of objects between JSON and CSV (RFC-4180 quoted fields) |
| 26 | **Line Sort & Dedupe** | Sort A-Z / 0-9 / by length, dedupe, reverse, or shuffle lines |
| 27 | **HEX ↔ ASCII** | Convert hex bytes to ASCII text and back |
| 28 | **Unicode Inspector** | Inspect a character's codepoint, UTF-8, UTF-16, HTML entity |
| 29 | **Tab ↔ Spaces** | Convert tabs to spaces and back, configurable width |
| 30 | **Whitespace Normalizer** | Collapse spaces, trim lines, normalize line endings |
| 31 | **String Reverser** | Reverse text by characters, words, or lines |
| 32 | **CSS Unit Converter** | Convert px ↔ rem ↔ em ↔ pt ↔ vw with base size |
| 33 | **Date Calculator** | Add/subtract days, calculate date differences |
| 34 | **Unix Permissions** | Convert Unix permissions: numeric ↔ symbolic |
| 35 | **MIME Types** | Searchable file extension → MIME type reference |
| 36 | **Time Zone Converter** | Convert a time across major world time zones |
| 37 | **Caesar / ROT13** | Caesar cipher with adjustable shift, including ROT13 |
| 38 | **Passphrase Generator** | Generate memorable Diceware-style word passphrases |
| 39 | **IPv4 Subnet Calculator** | CIDR calculator: network, broadcast, host range, mask |
| 40 | **Hash Identifier** | Identify a hash's likely algorithm by length and charset |

## Search & Keyboard Shortcuts

- **Search bar** at the top of the sidebar — fuzzy-matches tool names and descriptions
- `/`: focus the search bar
- `Esc`: clear search and blur
- `Enter` in search: jump to first match
- `1`–`9`: jump to tools 1 through 9
- `0`: jump to tool 10
- `⌘1`–`⌘0` / `Ctrl1`–`Ctrl0`: same, works even when typing in a field

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui** (New York style)
- **next-themes** for dark mode
- **lucide-react** for icons
- **diff** npm package (only runtime dependency beyond the framework)
- **bun** as package manager

## Privacy

DevToys runs entirely in your browser. Every tool processes your input locally
with JavaScript — nothing is ever transmitted to any server. There is no
analytics, no tracking, no cookies. The only thing stored is your settings
(theme, last active tool, terms acceptance) in your browser's `localStorage`.

## Local Development

```bash
bun install
bun run dev
```

Open http://localhost:3000.

## Deploy to Vercel

This project is configured for zero-config Vercel deployment:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: DevToys"
   git branch -M main
   git remote add origin https://github.com/<your-username>/devtoys.git
   git push -u origin main
   ```

2. **Import on Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - **Framework preset**: Next.js (auto-detected)
   - **Build command**: `next build` (already in `package.json`)
   - **Output directory**: leave default (Vercel handles Next.js output)
   - **Environment variables**: none required
   - Click **Deploy**

3. **That's it.** Vercel will build and deploy in ~60 seconds. No env vars, no
   server config, no database.

### Why zero-config?

- `next.config.ts` uses `typescript.ignoreBuildErrors: true` (per spec) — no
  type-check failures block deploy
- `package.json` `build` script is plain `next build` — no standalone output
  copying needed
- No environment variables — 100% client-side
- No database — no Prisma migrate needed at deploy time

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout: fonts, ThemeProvider, TermsGate, Sonner
│   ├── page.tsx            # Main shell: Header + Sidebar + ToolPanel + Footer
│   └── globals.css         # Tailwind 4 + theme tokens (light/dark)
├── components/
│   ├── devtoys/            # Shell: Header, Footer, Sidebar, ToolPanel, etc.
│   │   ├── tool-registry.ts  # Array of { id, name, icon, component }
│   │   └── ...
│   └── tools/              # One file per tool
│       ├── json-formatter.tsx
│       ├── base64-tool.tsx
│       └── ... (12 tools)
└── lib/
    ├── utils.ts            # cn() helper
    └── devtoys/
        ├── md5.ts          # Pure-JS MD5 implementation
        └── cron-parser.ts  # 5-field cron parser

public/
└── favicon.svg             # Flat braces {} logo
```

## Adding a New Tool

1. Create `src/components/tools/my-tool.tsx` — a single React component.
2. Add an entry to `TOOLS` in `src/components/devtoys/tool-registry.ts`:
   ```ts
   { id: "my-tool", name: "My Tool", icon: SomeLucideIcon, component: MyTool },
   ```
3. Done. It appears in the sidebar automatically.

## Author

**Jeffrey Hamilton**
- GitHub: [@JeffreyHamilton6399](https://github.com/JeffreyHamilton6399)
- Donate: https://buymeacoffee.com/jeffreyscof

## License

MIT — fork it, modify it, self-host it.
