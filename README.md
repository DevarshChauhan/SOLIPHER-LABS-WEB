# Solipher Labs — website

Next.js 16 (App Router) + Tailwind CSS v4 + Framer Motion. Red/black theme, patent-backed positioning — no mechanism/architecture details anywhere on the site by design.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/                  routes (App Router) — one folder per page
  components/
    layout/              Header, Footer
    home/                homepage-only sections (Hero, RobotDeskScene, stats, etc.)
    mascot/              the RoboDog character, its context, and the floating widget
    ui/                  shared primitives (Button, Container, PageHero, Logo, ...)
    contact/             the contact form
  lib/
    data/                site-wide content: site.ts, research.ts, products.ts, services.ts, portfolio.ts, mascotMessages.ts
    copyVariants.ts       3-4 headline/description variants per page + the random-pick helper
```

**All copy lives in `src/lib/data/*` and `src/lib/copyVariants.ts`.** To update a stat, a product, or headline wording, edit the data file — you shouldn't need to touch a page component for a content change.

## Content editing guide

- **Research facts** (`lib/data/research.ts`): problem + scale + measured impact only. No architecture/mechanism fields exist in this data shape on purpose — don't add them back without checking with whoever owns the IP.
- **Products** (`lib/data/products.ts`): each product needs `problem`, `impact`, `features` (benefit-oriented, not mechanism), and `pricing` tiers.
- **Headline shuffle** (`lib/copyVariants.ts`): each page picks one of 3-4 variants at request time (`export const dynamic = "force-dynamic"` on that page keeps it re-randomizing per visit instead of freezing at build time — don't remove that line unless you also want to remove the shuffle).
- **Mascot messages** (`lib/data/mascotMessages.ts`): keyed by nav href, drives the floating character's speech bubble + pose when a visitor hovers a nav link. `RoboDogPose` is `"idle" | "sniff" | "wag" | "wave"`.

## Deployment

### Vercel (recommended — zero config)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Vercel auto-detects Next.js — no build settings to change.
4. Add environment variables if you introduce any (none required today).
5. Set the production domain (`solipherlabs.in`) under Project → Settings → Domains.

### Netlify

1. Push the repo, then "Add new site" → "Import an existing project" in Netlify.
2. Build command: `npm run build`. Publish directory: `.next` (Netlify's Next.js runtime handles the rest automatically via the official Next.js plugin — it should attach itself; if not, add `@netlify/plugin-nextjs` in `netlify.toml`).
3. Set the domain under Site settings → Domain management.

### Any Node host (self-managed)

```bash
npm run build
npm run start   # serves on port 3000 by default
```

Put a reverse proxy (nginx, Caddy) in front for TLS.

## Before going live

- [ ] Swap placeholder social links in `lib/data/site.ts` (`linkedin`, `github`, `x`) for real profile URLs, or remove the ones that don't exist yet.
- [ ] Confirm `contact@solipherlabs.in` is a monitored inbox — the contact form composes a `mailto:` link client-side; there's no backend email service wired up yet.
- [ ] If you want the contact form to actually submit without opening the visitor's email client, swap `ContactForm.tsx`'s `handleSubmit` for a real form backend (Resend, SendGrid, Formspree, or a Next.js API route) — the UI and validation are already built, only the submit action needs to change.
- [ ] Double-check every stat and product claim against what's actually shippable before launch — several products are marked "early access" on purpose; don't flip them to "available" without checking.
- [ ] Run `npm run build` locally once more right before deploying — it will fail loudly on any type error.

## Image optimization notes

- No custom images are used yet (the site is built from SVG/CSS illustration — the logo, the mascot, and the desk scene are all inline SVG, so there's nothing to optimize there).
- If you add photography or screenshots later: use Next.js `<Image>` from `next/image` (not a plain `<img>`), keep source files under ~500KB, and prefer WebP/AVIF. Next.js will automatically generate responsive sizes and lazy-load off-screen images.
- Any file added to `public/` is served as-is with no optimization — only images passed through `next/image` get resized/compressed.

## Maintenance

- `export const dynamic = "force-dynamic"` on every inner page opts those routes out of static generation (required for the headline shuffle to re-roll per request). This is fine at this traffic scale; if the site later needs edge caching for cost/performance reasons, the shuffle would need to move client-side (with a hydration-safe pattern) instead.
- The mascot's poses and animations are pure CSS keyframes in `globals.css` (prefixed `rd-`) — respects `prefers-reduced-motion`.
- Favicon is `src/app/icon.svg` (Next.js App Router auto-serves it) — no `favicon.ico` in this project by design; keep it that way unless you have a reason to add one back.
