# AGENTS.md - Smart Start Next

## Commands

```bash
npm run dev:css    # Start dev server with Tailwind watching
npm run css        # Build CSS only
npm run build:css  # Build CSS + Next.js production build
npm run build      # Build Next.js only (CSS must be built first)
npm start          # Run production build
```

## Key Details

- **Framework**: Next.js 14 (App Router), React 18, Tailwind CSS 3.4
- **BasePath**: `/kasiro_start_page` - project is deployed to GitHub Pages
- **CSS workflow**: Tailwind compiles to `src/app/globals.css` from `src/app/main.tailwindcss`. Always run CSS build before dev/production builds.
- **State**: LocalStorage-based (no backend). Settings persist across sessions.
- **No tests**: Project has no automated tests.

## Project Structure

```
src/app/
├── page.js           # Main start page
├── layout.js         # Root layout
├── components/      # 18 React components (modals, dock, search, etc.)
├── main.tailwindcss # Source Tailwind styles
└── globals.css      # Compiled output (committed to repo)

src/lib/
├── constants.js      # App constants
├── hooks.js         # Custom hooks
└── utils.js         # Helpers
```

## Verified Notes

- Mobile background "jitter" fixed with `background-attachment: scroll` on mobile (QWEN.md)
- DesktopDock has macOS-style hover magnification
- ResponsiveDock switches between MobileDock/DesktopDock based on screen width
