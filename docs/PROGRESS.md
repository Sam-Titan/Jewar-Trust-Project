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
| 5 — Polish & demo-ready  | ⬜ Not started |

**Current phase:** 4 done; Phase 5 next (waiting for Sam)
**Repo:** `Jewar-Trust-Project`
**Live URL:** not deployed (deploy happens in Phase 5; D-026)

## Next steps

1. Sam: check the card on a real laptop and phone (drag feel, vertical swipe from the pouch, toast).
2. Phase 5 — polish and demo-ready, only when Sam says so. JS budget: 442.5 KB gzip now (limit 450 KB).

## Open questions (for Sam / client)

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

## Session log

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
