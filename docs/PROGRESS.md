# PROGRESS — Jewar Trust Demo (V1)

_Update at the end of every session. Newest log entry on top._

## Status

| Phase                    | Status         |
| ------------------------ | -------------- |
| 0 — Setup & first deploy | ⏳ Next        |
| 1 — 3D pouch             | ⬜ Not started |
| 2 — Hero                 | ⬜ Not started |
| 3 — Scroll story         | ⬜ Not started |
| 4 — Product card         | ⬜ Not started |
| 5 — Polish & demo-ready  | ⬜ Not started |

**Current phase:** 0
**Repo:** `Jewar-Trust-Project`
**Live URL:** _not deployed yet_ (will be `https://<username>.github.io/Jewar-Trust-Project/`)

## Next steps

1. Sam confirms git `user.name` / `user.email`, then I commit `phase-0: setup and first deploy`.
2. Sam creates the GitHub repo `Jewar-Trust-Project`, adds the remote, turns on Pages (Settings → Pages → Source: GitHub Actions) and tells me to push.
3. Check the live URL, then Phase 0 is done. Phase 1 only when Sam says so.

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
- **Not done:** commit (waiting for Sam to confirm git name/email), push, live deploy (needs repo + Pages).

### 2026-11-14 — Planning (Claude.ai)

- Brief, design, toolkit, 3D plan, phases and fonts approved.
- Reference pack made (`assets/reference/`).
- Docs written: CLAUDE.md, SPEC, PHASES, PROGRESS, DECISIONS.
