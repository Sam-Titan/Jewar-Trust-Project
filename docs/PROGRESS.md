# PROGRESS — Jewar Trust Demo (V1)

_Update at the end of every session. Newest log entry on top._

## Status

| Phase                    | Status         |
| ------------------------ | -------------- |
| 0 — Setup                | ✅ Done        |
| 1 — 3D pouch             | ✅ Done        |
| 2 — Hero                 | ⬜ Not started |
| 3 — Scroll story         | ⬜ Not started |
| 4 — Product card         | ⬜ Not started |
| 5 — Polish & demo-ready  | ⬜ Not started |

**Current phase:** 1 done; Phase 2 next (waiting for Sam)
**Repo:** `Jewar-Trust-Project`
**Live URL:** not deployed (deploy happens in Phase 5; D-026)

## Next steps

1. Phase 2 — Hero, only when Sam says so.

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
