# CLAUDE.md — Jewar Trust (Demo 3D Website, V1)

Repo: `Jewar-Trust-Project` · Live: `https://<username>.github.io/Jewar-Trust-Project/`

You are building a **demo 3D website** for the Jewar brand's **Everyday Basmati Rice**. It is a single scroll page, static, deployed on **GitHub Pages**. It will be shown to the client as a pitch.

Read these before every session, in this order:

1. `docs/PROGRESS.md` — where we are, what's next, open questions.
2. `docs/PHASES.md` — the current phase's tasks and "done when" checks.
3. `docs/SPEC.md` — what to build, look, content, structure.
4. `docs/DECISIONS.md` — why things are the way they are. Don't undo a decision without asking.

---

## Hard rules

1. **Git authorship — Sam only.**
   - Commits and pushes use Sam's own git identity (`git config user.name/user.email`). Never change git config.
   - **No** `Co-Authored-By` trailers, **no** "Generated with Claude Code" lines, **no** session links in commits or PRs. `.claude/settings.json` turns these off; the Lefthook `commit-msg` hook blocks them too.
   - Never add collaborators, bots or apps to the GitHub repo.
2. **Approved toolkit only.** Use only the tools listed below. No new package, library, service or file type without Sam's approval. If you think something is needed, stop and ask — write it under "Open questions" in `docs/PROGRESS.md`.
3. **Stay inside the current phase.** Finish its tasks and checks. Don't start the next phase until Sam says so.
4. **Content truth.**
   - Never call this product "organic". Only Jewar's Premium rice is organic.
   - Use only facts from `docs/SPEC.md` § Content. Anything not confirmed is marked `TO CONFIRM` in `src/data/product.ts` — don't invent numbers.
5. **Brand pack is the source of truth** for colours, art and tone (`assets/reference/`).
6. **Keep it light.** 3D must run smoothly on a normal laptop or phone. Respect the budgets in SPEC.
7. **No secrets, no .env, no backend, no analytics.** This is a static demo.
8. **Short, plain language** in docs, comments and commit messages.

## End of every work session

- `just check` passes (Biome + type check).
- `just build` passes.
- Visual check with Playwright MCP: open the page, look at desktop (1440×900) and phone (390×844), read the console — no errors.
- Update `docs/PROGRESS.md` (what was done, what's next, open questions). Add any new decision to `docs/DECISIONS.md`.
- Commit with a short message: `phase-N: what changed`. Push only when Sam asks.

---

## Approved toolkit

**Setup:** WSL2 (Ubuntu), Node 24, pnpm (via corepack), just, Git + GitHub, Lefthook + Gitleaks, Claude Code.

**Frontend:** Vite, React + TypeScript, Tailwind CSS v4, shadcn/ui, lucide-react, Zustand, Motion, sonner, @fontsource (Fraunces, Inter).

**3D:** three.js, React Three Fiber, drei, r3f-perf (dev only), Blender (latest LTS, headless, scripted), gltf-transform.

**Quality & deploy:** Biome, `tsc`, Playwright + @playwright/mcp, Lighthouse CI, GitHub Actions, Dependabot.

**Not used (do not add):** any backend/Python web stack, React Router, TanStack Query, react-hook-form, zod, postprocessing, vitest, gltfjsx, analytics, Docker.

## Commands (Justfile)

| Command         | What it does                                            |
| --------------- | ------------------------------------------------------- |
| `just setup`    | Install packages, install Lefthook hooks                |
| `just dev`      | Vite dev server                                         |
| `just check`    | Biome lint/format check + `tsc --noEmit`                |
| `just fix`      | Biome auto-fix                                          |
| `just build`    | Production build to `dist/`                             |
| `just preview`  | Serve `dist/` locally (with the GitHub Pages base path) |
| `just model`    | Run Blender script → raw `.glb` + preview PNGs          |
| `just optimize` | gltf-transform → `public/models/pouch.glb`              |
| `just test`     | Playwright smoke test                                   |
| `just lh`       | Lighthouse CI on the built site                         |

## Key technical notes

- **GitHub Pages base path:** repo is `Jewar-Trust-Project`, so Vite `base` = `/Jewar-Trust-Project/` (case-sensitive, see DECISIONS D-011). Always load files with `import.meta.env.BASE_URL`, never a hard-coded `/`.
- **Scroll:** native page scroll + sticky canvas. Motion `useScroll` gives progress (0–1); the pouch reads it inside `useFrame`. Do not use drei `ScrollControls`.
- **Two canvases:** the main page canvas and the product-card canvas. Pause the main one (`frameloop="demand"`) while the card is open.
- **Reduced motion:** if `prefers-reduced-motion`, no auto-float, no scroll-linked spin — show properties as a simple list with the pouch still.
- **No WebGL:** show the static pouch image (`public/images/pouch-front.webp`) instead of the canvas.
- **Blender:** run headless only: `blender -b -P blender/build_pouch.py -- …`. No GPU. Preview renders use Workbench or Cycles CPU at low samples.
