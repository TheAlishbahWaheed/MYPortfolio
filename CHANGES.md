# What changed


Your content, sections, projects, experience, links, resume flow and overall identity are **100% unchanged** — verified with a diff against the original repo. Everything below is additive scaffolding or behavior, layered on top of your existing dark/glassmorphic design system.

## New
- **GSAP + ScrollTrigger + ScrollToPlugin** loaded from CDN (`index.html`), used for everything below. Every feature checks `typeof gsap` first, so if the CDN is ever blocked, the site still works exactly as it did before — just with the original lighter motion.
- **`motion.js`** — the new module that does the following:
  - Hero headline reveals line-by-line right as the loader clears (your existing `.line > span` markup was already set up for this — no HTML change needed there).
  - Every section heading (`h2`) now splits into words at runtime and reveals with a scroll-triggered stagger.
  - Parallax on the background grid, glow, and hero neural-network canvas.
  - Two large, slow ambient gradient blobs that drift with scroll and gently follow the cursor (desktop only) for extra depth, separate from your existing cursor-local glow.
  - The experience timeline's connecting line now draws in with an accent gradient as you scroll through it (new `.tl-progress` element, your original line stays as the base track).
  - Anchor links (`nav`, hero CTA, footer, "scroll" hint) now scroll with an eased GSAP tween instead of the default browser jump.
- **Animated project-card preview strips** — a small code-motif header (drifting grid + a scanning light sweep + a `</>`. glyph) on each of your 6 project cards. Pure CSS/decoration, not a fabricated screenshot.
- `robots.txt` and `sitemap.xml` for basic SEO hygiene, plus a `meta robots` tag.

## Upgraded (same files, smoother physics)
- `tilt.js` — card 3D tilt now uses GSAP `quickTo` for buttery interpolation and an elastic snap-back on mouse leave. Falls back to the original version if GSAP didn't load. Now also covers achievement cards and the AI-pipeline steps, not just project/cert/skill cards.
- `cursor.js` — magnetic buttons use the same GSAP approach for a smoother pull and spring release.
- `projects.js` — filtering animates cards out/in with a stagger instead of an instant swap; the project detail modal's contents stagger in.
- `resume.js` — the resume modal's form and success state stagger in.
- `nav.js` — mobile menu links stagger in when the menu opens.
- `loader.js` / `style.css` — the loader's exit now has a subtle scale + blur, and dispatches a `portfolio:loaded` event other scripts can hook into.

## Respecting `prefers-reduced-motion`
All new GSAP-driven motion bails out completely for users with reduced-motion enabled (checked at the top of `motion.js`, and per-feature in `tilt.js`/`cursor.js`/`projects.js`/`resume.js`/`nav.js`). Your existing global reduced-motion CSS rule still governs everything else, unchanged.

## To deploy
Copy these files over your existing repo (or just replace the whole folder) and push — Vercel will pick it up automatically. Nothing needs a build step; it's still plain HTML/CSS/JS.
