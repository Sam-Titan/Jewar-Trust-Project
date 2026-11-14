# PHASES — Jewar Trust Demo (V1)

**Every phase ends with:** `just check` + `just build` pass · Playwright visual check (desktop + phone, no console errors) · `docs/PROGRESS.md` updated · commit under Sam's name only · all checks local (D-026); deploy only in Phase 5.

Do one phase at a time. Start the next only when Sam says so.

---

## Phase 0 — Setup

**Tasks**

- Vite + React + TS app with pnpm. Set Vite `base` to `/<repo-name>/`.
- Tailwind v4 with colour tokens (`cream`, `green`, `red`, `rice`) and fonts (Fraunces, Inter via @fontsource).
- shadcn/ui init (no components yet beyond what's needed).
- Biome, `tsc`, Justfile (all commands in CLAUDE.md, model/optimize/lh can be stubs).
- Lefthook: pre-commit (Biome, `tsc`, `gitleaks protect --staged`); commit-msg (block `Co-Authored-By` / "Generated with").
- `.claude/settings.json` with attribution off.
- GitHub Actions: `ci.yml` (on push), `deploy.yml` (manual `workflow_dispatch` only; used in Phase 5). Dependabot.
- Copy reference pack into `assets/reference/`.
- Placeholder page: cream background, wordmark image, "Coming soon" in Fraunces.

**Done when:** placeholder page runs locally under `/Jewar-Trust-Project/` (`just preview`) with correct colours, fonts and wordmark; hooks block a test commit with a `Co-Authored-By` line.

---

## Phase 1 — 3D pouch

**Tasks**

- `blender/build_pouch.py`: build the pouch per SPEC § 4, UV-map front/back, materials, export `blender/out/pouch-raw.glb`.
- Same script renders previews (front, 3/4, side, back) to `blender/previews/` and `public/images/pouch-front.webp`.
- `just model` and `just optimize` (gltf-transform → `public/models/pouch.glb`).
- Compare previews with `assets/reference/03-shape-reference.jpg`; adjust until it looks right.

**Done when:** previews look like the real pouch (shape, puff, red top band, stands upright); `pouch.glb` < 1.5 MB and < 20k triangles. Sam approves the previews.

---

## Phase 2 — Hero

**Tasks**

- `StoryCanvas` with `Pouch` loaded via drei `useGLTF`; lighting + contact shadow per SPEC.
- Slow float/turn idle animation.
- Hero layout: wordmark, brand line, scroll hint. Responsive.
- `Loader` screen; no-WebGL fallback image; reduced-motion handling.

**Done when:** hero looks right on desktop and phone; loader and fallbacks work; 60 fps on desktop (check with r3f-perf in dev).

---

## Phase 3 — Scroll story

**Tasks**

- Sticky section; Motion `useScroll` → progress in Zustand/ref → pouch rotation in `useFrame`.
- 5 property callouts (SPEC § 5) slide in step by step; badge on step 4.
- "Explore the product" button at the end (opens nothing yet).
- Farm strip with light parallax. Footer.
- Reduced-motion version: simple list.

**Done when:** scrolling is smooth on a normal laptop and phone; every property is readable; no layout jumps.

---

## Phase 4 — Product card

**Tasks**

- shadcn Dialog: `ViewerCanvas` (drag to turn, small zoom, auto-reset) on the left, details on the right (stacked on phone).
- `SizeToggle` 1 kg / 5 kg updates price and net weight; `TO CONFIRM` values hidden.
- Add to Cart / Buy Now → sonner toast "This is a demo — checkout isn't live."
- Pause main canvas while open. Focus trap, Esc to close.

**Done when:** card opens/closes cleanly on desktop and phone; pouch drags smoothly; toggle and toast work.

---

## Phase 5 — Polish & demo-ready

**Tasks**

- Lighthouse CI targets (SPEC § 8); fix what fails.
- r3f-perf check; trim draw calls/texture size if needed.
- Mobile pass (real phone if possible), accessibility pass, meta tags + OG image + favicon.
- Playwright smoke test: page loads, story scrolls, card opens, toast shows.
- Deploy (Sam runs `deploy.yml`, sets Pages source, checks the live URL). Write a short **pitch checklist** in `docs/PROGRESS.md` (link, what to show, what is placeholder).

**Done when:** all Lighthouse targets met, smoke test green in CI, Sam signs off.
