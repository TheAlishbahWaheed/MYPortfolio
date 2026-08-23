# Portfolio Upgrade — Deployment Notes

## What changed
- Full visual redesign: dark, glassmorphic, "AI + software developer" aesthetic
  (was a light pastel theme). Same vanilla HTML/CSS/JS stack — no framework
  added, so it drops straight into your existing Vercel project.
- Content rewritten to match your resume exactly:
  - Experience section now lists **Askari Bank, FlyRank AI, Foram Studios,
    and the Cyber-Security Workshop** (the old site had a "CodeAlpha" entry
    that wasn't on your resume — removed).
  - Education, certifications, achievements, and the AI & Digital Governance
    research publication are all pulled from your resume.
  - Project GitHub links now point to your **real, specific repos** instead
    of the generic profile link:
    - DSA Visualizer → `First-Front-End-Project-DSA-Visualizer`
    - Reflecto → `Reflecto`
    - AI Resume Analyzer → `Resume-Analyzer`
    - Google Search Ranking Capstone → `flyrank-ml-internship`
    - This Portfolio → `MyPortfolio`
    - Smart Home Automation → I couldn't confirm a dedicated public repo for
      this one (GitHub's API was rate-limited while I checked), so it links
      to your GitHub profile for now — swap in the real repo URL in
      `index.html` (search `data-title="Smart Home Automation`) once you
      have it handy.
- New features: animated hero with typewriter roles, cursor-reactive neural
  network canvas, magnetic buttons, custom cursor (desktop only), glass
  navbar with a sliding active-section indicator, animated stat counters,
  project filters (All / AI / Web / Python) with 3D-tilt cards and a
  detail modal, an AI-pipeline canvas visualization, validated contact form,
  and a resume-request modal that collects an email before triggering the
  real `resume.pdf` download.
- Accessibility & performance: skip link, visible focus states, `aria-*` on
  interactive elements, `prefers-reduced-motion` respected everywhere
  (custom cursor and all major animations disable cleanly), canvases use
  capped device-pixel-ratio, JSON-LD structured data, Open Graph/Twitter
  meta tags, and no console-breaking selectors (verified: all `id`s used in
  JS exist in the HTML; all HTML tags balance).

## Files
Vanilla static site — no build step:
```
index.html
style.css
loader.js      – boot loader
main.js        – scroll progress bar, back-to-top, footer year
cursor.js      – custom cursor + magnetic buttons (desktop only)
nav.js         – navbar scroll state, active-section pill, mobile menu
typing.js      – hero role typewriter
reveal.js      – scroll reveals + animated counters
particles.js   – hero neural-network canvas + AI pipeline panel canvas
tilt.js        – 3D hover tilt for cards
skills.js      – animated skill bars
projects.js    – project filters + detail modal
resume.js      – resume-request modal + real PDF download
contact.js     – contact form validation
resume.pdf     – your resume file (served for the download flow)
favicon.svg
```

## Deploy
Drop these files into your existing `MyPortfolio` repo (same file names —
this replaces `index.html`, `style.css`, and all the `.js` files). Push to
the branch Vercel deploys from and it'll go live automatically. No new
dependencies, environment variables, or build settings needed.

## One thing to double check
The contact form currently gives a friendly confirmation but doesn't send
anywhere — there's no backend wired up yet (same as the previous version).
If you want it to actually deliver messages, the easiest options are
Formspree, EmailJS, or a small serverless function on Vercel — happy to
wire one up if you want.
