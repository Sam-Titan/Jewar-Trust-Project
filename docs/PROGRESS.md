# PROGRESS — Jewar Trust Demo (V1)

_Update at the end of every session. Newest log entry on top._

## Status

| Phase                    | Status         |
| ------------------------ | -------------- |
| 0 — Setup                | ✅ Done        |
| 1 — 3D pouch             | ✅ Done        |
| 2 — Hero                 | ✅ Done        |
| 3 — Scroll story         | ✅ Done        |
| 4 — Product card         | ✅ Done (waiting for Sam's check) |
| 5 — Polish & demo-ready  | 🟡 In progress (one open item: Lighthouse performance) |

**Current phase:** 5 (code done except the performance score; deploy is Sam's)
**Repo:** `Jewar-Trust-Project`
**Live URL:** not deployed (deploy happens in Phase 5; D-026)

## Next steps

1. Sam: decide on the Lighthouse performance score (see Open questions) .
2. Sam: check on a real phone and laptop (fps, drag feel, toast).
3. Sam: commit, push, set Pages source to "GitHub Actions", run `deploy.yml`, open the live URL.
4. Fill in the live URL in `index.html` (`og:image` needs a full URL to work in link previews).

## Open questions (for Sam / client)

- [ ] **Lighthouse performance (mobile) is 0.66–0.68; target is 0.80.** Accessibility 1.00, Best Practices 1.00, SEO 1.00 pass. The only failing metric is Total Blocking Time (about 5.6 s). It comes from the 3D chunk: three.js start-up, shader compile and model upload, run with Lighthouse's 4× mobile CPU slowdown on headless Chromium's **software** GL (no GPU). With no CPU slowdown the score is 0.85 (TBT 570 ms). LCP 0.8 s, CLS 0.001. Real phones have a GPU, so this probably overstates it, but I can't prove that here. Options: (a) accept and note it, measure on a real phone with PageSpeed Insights after deploy; (b) lower the bar for the 3D page in `lighthouserc.json`; (c) spend more work cutting start-up cost (e.g. smaller env map, fewer lights, delay the canvas). A quick try of 128 px environment + dpr 1.5 did not change the score, so it was reverted.
- [x] GitHub repo name: `Jewar-Trust-Project`.
- [ ] Real 5 kg price (placeholder ₹780 in use).
- [ ] Origin, shelf life, cooking instructions — confirm or keep hidden.
- [ ] Real back-of-pack artwork? (Current back is a concept.)
- [x] Footer credit: "Demo by Swayam Bansal".

## Placeholders in the demo (tell the client)

- Back of the pouch is a concept, not their artwork.
- Add to Cart / Buy Now don't work.
- 5 kg price is a placeholder.
- Anything marked TO CONFIRM is hidden.

## Pitch checklist

- **Link:** `https://<username>.github.io/Jewar-Trust-Project/` (after deploy).
- **Show, in order:** hero (pouch floats) → scroll: five properties, pouch turns, badge on step 4 → "Explore the product" → drag the pouch, switch 1 kg / 5 kg → Add to Cart (demo toast) → farm strip and footer.
- **Say up front (placeholders):** back of the pouch is a concept, not their artwork; Add to Cart / Buy Now don't work; 5 kg price (₹780) is a placeholder; origin, shelf life and cooking text are hidden until confirmed.
- **Don't say:** "organic" about this product (the logo says it; only Premium is organic).
- **Backup:** if the 3D fails, the page shows the still pouch. Reduced-motion users get a plain list.
- **Before the meeting:** open the live URL on the demo laptop and a phone once, to warm the cache.

## Session log

### 2026-11-14 — Phase 5 (Claude Code)

- Added `@lhci/cli` and `@playwright/test` (both in the approved toolkit; D-044). `just test` builds and runs the smoke test; `just lh` builds and runs Lighthouse CI (3 runs, mobile).
- Smoke test (`tests/smoke.spec.ts`): page loads, story scrolls (first and last callout show), card opens, Add to Cart toast shows, Esc closes, no console errors; plus a reduced-motion check. Green locally. CI now installs Chromium and runs it.
- Lighthouse (mobile): Accessibility 1.00 (was 0.93: low-contrast small text, now `text-green/80` minimum), Best Practices 1.00, SEO 1.00, Performance 0.66–0.68 (see Open questions).
- Meta: description, theme colour, Open Graph and Twitter tags, `og-image.png` (1200×630, pouch + wordmark; the "organic" logo is not used on it). Favicon was already there.
- Static `pouch-front.webp`: baked shadow's square edge removed by fading the alpha at the edges (no re-render). Used by the no-WebGL fallback, the card fallback and the OG card.
- WSL quirk: Lighthouse drops `C:\Users\...` temp folders in the repo root, which crashed Biome. They are gitignored, excluded from Biome, and `just lh` deletes them.
- Checked at 1440×900 and 390×844 with Playwright MCP: hero fine, 0 console errors.
- Not done: r3f-perf fps and real-phone pass (headless has no GPU). Please check on your devices. JS budget unchanged (443 KB gzip).

### 2026-11-14 — Phase 4 fixes (Claude Code)

- Logo (D-041, D-010 updated): `jewar-logo.png` used unchanged → `jewar-logo.webp` (lossless, transparent). Small in the hero header and the footer; alt "Jewar Organic logo". The big hero wordmark is gone (Sam: say if you want it back).
- Layout (D-042): wide = text left / pouch right, pouch eases to centre for the story; portrait = pouch top half, text below, scroll hint at the bottom. Breakpoint is aspect 1:1 for both CSS and 3D (width alone broke on tablets).
- Card (D-043): "Demo price" line removed; 2-column specs and notes; 541 px tall at 1440×900, no scrollbar, same height at 1 kg and 5 kg. Fixed the selected size pill turning pale on hover.
- Check: `tests/pouch-overlap.js` (run with the Playwright MCP against `just preview`): hero + 5 steps + end, at 1440×900 and 390×844. 14 cases, 0 overlaps. Also checked that it fails when a callout is pushed onto the pouch.
- Also checked: hero desktop/phone, reduced-motion hero (still pouch, same layout), footer, card on phone, no console errors.
- gzip: initial 133.1 KB, 3D 280.8 KB (StoryCanvas 1.4 + shared 279.4), card 29.1 KB, total 443.0 KB.
- Notes: `?debug=pouch` adds a few lines of measuring code to the 3D chunk; it does nothing without the flag. `tests/pouch-overlap.js` is excluded from Biome.

### 2026-11-14 — Phase 4 (Claude Code)

- Key light 1.4 → 1.9 (D-036). Plain paper 229–234 → 237–240 (photo 245). Red band kept (176/26/39, no clipping). Lights moved to `Lights.tsx`, shared by both canvases.
- Product card (D-039, D-040): shadcn-style Dialog, `ViewerCanvas` (drag to turn, no zoom, idle reset), `SizeToggle` (1 kg / 5 kg: price, MRP, % off, net weight), Add to Cart / Buy Now → toast "This is a demo — checkout isn't live." TO CONFIRM values (origin, shelf life, cooking) are hidden. 5 kg shows "Demo price for this size."
- **gzip:** initial JS **132.9 KB**, 3D chunk **280.4 KB** (unchanged: one shared copy of three/r3f/drei), card chunk **29.2 KB** (ProductCard 23.9 + ViewerCanvas 5.3). Total 442.5 KB (budget 450 KB).
- Checked with Playwright at 1440×900 and 390×844: card opens/closes (✕, Esc, outside click), focus trapped and returned to the button, no console errors, no layout shift (scrollY and sticky canvas rect unchanged before/during/after), page pouch intact after close. Page canvas drew 0 frames while the card was open and resumed after. `pouch.glb` loaded once. Touch (CDP): vertical swipe starting on the pouch scrolls the card; sideways swipe turns the pouch. Reduced motion: card works, pouch snaps back with no animation. No WebGL: card shows the static image; no 3D chunk requested (hover prefetch skips it).
- Found and fixed: r3f sets `touch-action: none` on its wrapper div, which blocked card scrolling even after the canvas was set to `pan-y`; orbiting the real camera made the pouch's side go black (lights are fixed), so the pouch is rotated instead.
- Not measured: fps on real devices (headless uses software GL, which also makes the card's close animation slow there). The static `pouch-front.webp` has a baked shadow with a visible square edge on tinted backgrounds (Phase 5: re-export or crop).

### 2026-11-14 — Phase 3 (Claude Code)

- D-035: 3D code is a lazy chunk. gzip: initial JS **132 KB**, 3D chunk **280 KB**, total 412 KB (budget 450 KB). Loader progress now comes from the `ui` store.
- D-036: key light `#FFF4E6`. Paper sample (render vs photo): 216/208/200 vs 245/234/224. Hue is close; the render is darker. Left as asked (colour only); intensity could be raised if Sam wants it brighter.
- Scroll story: sticky canvas, per-step angles, callouts left/right on desktop and below the pouch on phone, badge on step 4, end state with "Explore the product" (does nothing until Phase 4). Farm strip with parallax, footer with socials (SPEC §7).
- Checked with Playwright at 1440×900 and 390×844: all five steps and end state readable, no horizontal scroll, no layout jumps, no console errors. Reduced motion: plain list, no sticky. No WebGL: static image, 3D chunk and `pouch.glb` never requested.
- Not measured: fps (headless uses software GL) and a real "text before 3D" gap (localhost is too fast to see it; the chunk is a separate request).
- Vite warns that the 3D chunk is over 500 KB raw. Expected; ignored.

### 2026-11-14 — Phase 2 (Claude Code)

- Added three, @react-three/fiber, drei, zustand, motion, r3f-perf (dev), @types/three (all approved).
- Hero: wordmark, `StoryCanvas` + `Pouch` (float + sway, D-031), brand line, scroll hint, `Loader`. Transparent canvas, Neutral tone mapping, procedural lights (D-033). Real `product.ts`, `ui` store, `useReducedMotion`, `useWebGL`.
- Playwright at 1440×900 and 390×844: pouch, text and scroll hint fit, no horizontal scroll, no errors. Console has only a `THREE.Clock` deprecation warning from R3F and a GPU-stall driver note.
- Network: every request is on localhost (the `blob:` ones are the model's textures). Colours compared with the reference photo: red band, cream and green look right.
- Reduced motion: pouch still and front-facing, no bounce. No WebGL (stubbed): static `pouch-front.webp`, no loader.
- JS 403 KB gzip (budget 450 KB). Not measured: fps with r3f-perf; headless Chromium uses software GL, so please check in `just dev` on your laptop.
- Phone: pouch is scaled 1.15× on tall screens (`Pouch.tsx`).

### 2026-11-14 — Phase 1 follow-up (Claude Code)

- Sam approved the previews.
- `just optimize` now uses `--simplify false` (D-030). `pouch.glb`: 479 KB, 8,710 triangles (budget 1.5 MB / 20k).
- Playwright check at 390×844: wordmark and "Coming soon" centred, no horizontal scroll, no console messages.

### 2026-11-14 — Phase 1 (Claude Code)

- `blender/build_pouch.py`: one watertight mesh (0 open edges, checked in the script), 8.7k tris. Front and back share edges at top and sides; open into a 9 cm gusset with a flat base. Sizes are constants at the top.
- Window shine: 128×207 roughness map (D-027). Export: metres, origin bottom-centre, front +Z.
- Renders: Cycles CPU, 64 samples, denoise. Previews in `blender/previews/` (front, three-quarter, side, back, below). `public/images/pouch-front.webp` is transparent (89 KB).
- `just model` and `just optimize` work. First `pouch.glb`: 464 KB, 4,375 triangles (simplify was on; see D-030) (budget 1.5 MB / 20k). Meshopt + WebP, textures capped at 2048.
- Added `@gltf-transform/cli` (D-028). `just check` and `just build` pass. Page loads, no console errors.
- Puff is tuned by eye against the reference photo; Sam may want it fuller or flatter (`PUFF` constant).

### 2026-11-14 — Phase 0 (Claude Code)

- Vite + React + TS, Tailwind v4 tokens, Fraunces/Inter (@fontsource), shadcn config + `cn` helper.
- Biome, `tsc`, Justfile, Lefthook (Biome, tsc, gitleaks, commit-msg guard), `.mcp.json` (Playwright), CI, deploy, Dependabot.
- Placeholder page checked at 1440×900 and 390×844: right colours, fonts, wordmark, no console errors.
- `just check` and `just build` pass. commit-msg hook tested on temp files (blocks `Co-Authored-By`, passes clean).
- Branch renamed to `main`. Notes: Biome once reformatted the `.md` docs (spacing only); `.md` now ignored by Biome.
- Sam committed and pushed (`e1a1a1e`). D-026: no `gh`, local checks only, deploy moved to Phase 5.

### 2026-11-14 — Planning (Claude.ai)

- Brief, design, toolkit, 3D plan, phases and fonts approved.
- Reference pack made (`assets/reference/`).
- Docs written: CLAUDE.md, SPEC, PHASES, PROGRESS, DECISIONS.
