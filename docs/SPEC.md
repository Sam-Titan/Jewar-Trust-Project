# SPEC — Jewar Trust Demo Website (V1)

## 1. Goal

A one-page, scroll-driven 3D product page for **Jewar Everyday Basmati Rice**, to pitch a modern redesign of jewarorganic.com to the client.

- **Scope:** one product only. Demo, not a live shop.
- **Hosting:** GitHub Pages (static). Repo: `Jewar-Trust-Project` → site URL `https://<username>.github.io/Jewar-Trust-Project/`.
- **Audience:** health-minded urban Indian families buying online. **Mobile-first.**
- **Versioning:** demo only — no upgrade plan for now.

## 2. Page flow

| #   | Section                   | What happens                                                                                                                                                                                                                                                                                  |
| --- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Hero**                  | JEWAR wordmark, 3D pouch floating slowly, brand line _"We Are Farmers, Growing Honest Food With Love & Care"_. Small "scroll" hint.                                                                                                                                                           |
| 2   | **Scroll story**          | Section is pinned (sticky). As you scroll, the pouch turns. Each step, one property slides in beside it (left/right alternating on desktop, below the pouch on phone). 5 steps — see § 5. Ends with the **"Explore the product"** button.                                                     |
| 3   | **Farm strip**            | Pack line art (`farm-strip`) moving slowly sideways with scroll (light parallax). Short line: _"Handpicked by each member of our family for yours."_                                                                                                                                          |
| 4   | **Product card** (dialog) | Opens from "Explore the product". Left: 3D pouch you can drag to turn (and pinch/scroll to zoom a little). Right: details (§ 6). Bottom: **Add to Cart** and **Buy Now** — not working; clicking shows a toast "This is a demo — checkout isn't live." Close with ✕, Esc or clicking outside. |
| 5   | **Footer**                | Free shipping above ₹999 · Cash on Delivery · Delivery all across India. Facebook + Instagram links. Small credit line: **"Demo by Swayam Bansal"**.                                                                                                                                          |

## 3. Look

**Colours (exact pack values):**

| Token   | Hex       | Use                               |
| ------- | --------- | --------------------------------- |
| `cream` | `#FDF8F4` | Page background                   |
| `green` | `#094233` | Text, headings, line art          |
| `red`   | `#B22C37` | Accents, buttons, badge           |
| `rice`  | `#E8D9B5` | Soft highlights, card backgrounds |

**Fonts:** Fraunces (headings) · Inter (body) — self-hosted via @fontsource. The JEWAR wordmark is the image from the pack, not typed text.

**Style:** calm, warm, lots of cream space. Line art from the pack as decoration. Soft shadows. Rounded corners (12–16 px). No neon, no dark mode.

**Trust badge:** Option 2 (oval "Tested for 900+ pesticides" stamp).

## 4. 3D pouch

Built in **Blender** by a Python script (`blender/build_pouch.py`), run headless.

- **Shape:** stand-up pouch (doypack) with bottom gusset. Front panel ~18 × 29 cm (texture ratio 0.62). Gusset ~9 cm. Gentle puff in the middle, flat top seal (~1.5 cm), thin side seals, slightly rounded corners.
- **Textures:** front `01-front-texture.png`, back `02-back-texture.png` (concept back — not client artwork). Sides and gusset: plain cream.
- **Material:** matte paper (roughness ~0.75, metalness 0). Rice-window area slightly glossy (roughness ~0.35), approx. x 365–1300, y 1890–2325 px on the front texture.
- **Script outputs:** `blender/out/pouch-raw.glb` + preview PNGs (front, 3/4, side, back) in `blender/previews/`, plus `public/images/pouch-front.webp` (used as loading image and no-WebGL fallback).
- **Optimize:** `gltf-transform optimize` → Meshopt + WebP textures, max 2048 px → `public/models/pouch.glb`.
- **Budgets:** `.glb` < 1.5 MB · < 20k triangles.
- **Scene:** soft studio light (drei `Environment` preset, low intensity) + one key light; soft contact shadow under the pouch. No post-processing.

## 5. Scroll-story properties

1. **Long grain** — slender, long basmati grains.
2. **Full aroma** — the classic basmati fragrance.
3. **EU-standard residue controls** — held to EU limits.
4. **Tested for 900+ pesticides** — with the trust badge.
5. **Handpicked by our family** — "Handpicked by each member of our family for yours."

Short supporting lines only. No numbers beyond what's on the pack.

## 6. Product card details

- **Name:** Everyday Basmati Rice
- **Tag:** Aromatic | Everyday Value
- **Size toggle:** 1 kg / 5 kg
- **Price (1 kg):** ₹160 (MRP ₹224, 28% off).
- **Price (5 kg):** **PLACEHOLDER** ₹780 (MRP ₹1,120, 30% off) — not a real price; flagged `placeholder: true` in `product.ts`. Replace when the client confirms.
- **Rating:** 5.0 (5 reviews) — show small, optional.
- **Description:** long grain, full aroma, EU-standard residue controls, tested for 900+ pesticides, handpicked by the family.
- **Specs:** Net wt 1 kg / 5 kg · Grain: long · Origin: TO CONFIRM · Shelf life: TO CONFIRM.
- **How to cook:** general basmati steps (rinse, soak, cook, rest) — marked TO CONFIRM.
- **Shopper notes:** Free shipping above ₹999 · Cash on Delivery · All-India delivery · Taxes included.

All of this lives in `src/data/product.ts`. Unconfirmed values are flagged `TO CONFIRM` in code and **not shown** as fact (hide or show "—"). Exception: the 5 kg price is shown as a placeholder so the toggle works in the demo.

## 7. Content sources

- Pack: `assets/reference/` (front art, product photo).
- jewarorganic.com (checked 2026-11-14): brand line, footer tagline, prices, shopper info, socials, registered office.
- Socials: Facebook `https://www.facebook.com/jewarorganic/` · Instagram `https://www.instagram.com/jewarorganics/`.
- **Never** use the word "organic" for this product.

## 8. Behaviour & quality

- **Responsive:** phone 390 px → desktop 1440 px+.
- **Reduced motion:** no float, no scroll spin; properties as a simple list.
- **No WebGL:** static pouch image instead.
- **Loading:** cream screen with wordmark and a small progress bar until the model loads.
- **Accessibility:** real buttons, focus rings, dialog traps focus, alt text on images, colour contrast AA.
- **Performance targets (Lighthouse, mobile):** Performance ≥ 80, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90. JS (gzip) < 450 KB excluding the model.
- **Meta:** title, description, Open Graph image (pouch render), favicon from the badge/wordmark.

## 9. Directory structure

```
Jewar-Trust-Project/
├── CLAUDE.md
├── README.md
├── Justfile
├── lefthook.yml
├── biome.json
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── components.json            # shadcn/ui config
├── playwright.config.ts
├── lighthouserc.json
├── index.html
├── .gitignore
├── .claude/
│   └── settings.json          # attribution OFF
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── ci.yml             # check + build + smoke test + Lighthouse
│       └── deploy.yml         # build + deploy to GitHub Pages
├── docs/
│   ├── SPEC.md
│   ├── PHASES.md
│   ├── PROGRESS.md
│   └── DECISIONS.md
├── assets/
│   └── reference/             # source art (not shipped)
│       ├── README.md
│       ├── 01-front-texture.png
│       ├── 02-back-texture.png
│       ├── 03-shape-reference.jpg
│       ├── 04-trust-badge.png
│       ├── 05-farm-strip.png
│       └── 06-wordmark.png
├── blender/
│   ├── build_pouch.py         # headless Blender script
│   ├── previews/              # preview renders (committed, small)
│   └── out/                   # raw .glb (git-ignored)
├── public/
│   ├── favicon.svg
│   ├── og-image.jpg
│   ├── models/
│   │   └── pouch.glb          # optimized
│   └── images/
│       ├── pouch-front.webp
│       ├── trust-badge.webp
│       ├── farm-strip.webp
│       └── wordmark.webp
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css              # Tailwind + colour/font tokens
│   ├── data/
│   │   └── product.ts         # all product text & prices
│   ├── store/
│   │   └── ui.ts              # Zustand: card open, size, scroll progress
│   ├── hooks/
│   │   ├── useReducedMotion.ts
│   │   └── useWebGL.ts
│   ├── lib/
│   │   └── utils.ts           # shadcn helper
│   └── components/
│       ├── ui/                # shadcn (dialog, button, toggle-group, sonner)
│       ├── three/
│       │   ├── Pouch.tsx      # loads pouch.glb
│       │   ├── StoryCanvas.tsx
│       │   └── ViewerCanvas.tsx
│       ├── sections/
│       │   ├── Hero.tsx
│       │   ├── ScrollStory.tsx
│       │   ├── FarmStrip.tsx
│       │   └── Footer.tsx
│       ├── product/
│       │   ├── ProductCard.tsx
│       │   └── SizeToggle.tsx
│       └── Loader.tsx
└── tests/
    └── smoke.spec.ts
```
