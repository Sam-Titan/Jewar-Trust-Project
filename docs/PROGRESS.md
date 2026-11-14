# PROGRESS — Jewar Trust Demo (V1)

_Update at the end of every session. Newest log entry on top._

## Status

| Phase                    | Status         |
| ------------------------ | -------------- |
| 0 — Setup & first deploy | ✅ Done (live check by Sam) |
| 1 — 3D pouch             | ⬜ Not started |
| 2 — Hero                 | ⬜ Not started |
| 3 — Scroll story         | ⬜ Not started |
| 4 — Product card         | ⬜ Not started |
| 5 — Polish & demo-ready  | ⬜ Not started |

**Current phase:** 0 (complete; Phase 1 not started)
**Repo:** `Jewar-Trust-Project`
**Live URL:** `https://sam-titan.github.io/Jewar-Trust-Project/` (to verify by Sam)

## Next steps

1. Sam checks the live URL (Pages source = GitHub Actions, Deploy run green).
2. Phase 1 (3D pouch) when Sam says so.

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

### 2026-11-14 — Phase 0 (Claude Code)

- Vite + React + TS, Tailwind v4 tokens, Fraunces/Inter (@fontsource), shadcn config + `cn` helper.
- Biome, `tsc`, Justfile, Lefthook (Biome, tsc, gitleaks, commit-msg guard), `.mcp.json` (Playwright), CI, deploy, Dependabot.
- Placeholder page checked at 1440×900 and 390×844: right colours, fonts, wordmark, no console errors.
- `just check` and `just build` pass. commit-msg hook tested on temp files (blocks `Co-Authored-By`, passes clean).
- Branch renamed to `main`. Notes: Biome once reformatted the `.md` docs (spacing only); `.md` now ignored by Biome.
- Sam committed and pushed (`e1a1a1e`). Live deploy not checked by Claude (no `gh` login); Sam verifies.

### 2026-11-14 — Planning (Claude.ai)

- Brief, design, toolkit, 3D plan, phases and fonts approved.
- Reference pack made (`assets/reference/`).
- Docs written: CLAUDE.md, SPEC, PHASES, PROGRESS, DECISIONS.
