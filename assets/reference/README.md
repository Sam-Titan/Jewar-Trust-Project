# Jewar Pouch — 3D Reference Pack

Reference files for Claude Code to build the Everyday Basmati Rice pouch in Blender (via Python script) and export it for the website.

## Files

| File | Use |
|---|---|
| `01-front-texture.png` | Front panel texture (1692×2733). Trust badge = Option 2 (oval stamp). |
| `02-back-texture.png` | Back panel texture (1692×2733). **Concept made for the demo** from front art pieces + facts from jewarorganic.com. Not client artwork. |
| `03-shape-reference.jpg` | Photo of the real pouch. Use for shape only (puff, top seal, red band, how it stands). Not a texture. |
| `04-trust-badge.png` | Trust badge, transparent. For the website (icon / property callout). |
| `05-farm-strip.png` | Line-art farm strip. For the website "farm strip" section. |
| `06-wordmark.png` | JEWAR wordmark, transparent. For the website hero / header. |

## Pouch spec

- **Type:** stand-up pouch (doypack) with a bottom gusset so it stands on its own.
- **Size (front panel):** ~18 cm wide × 29 cm tall (matches texture ratio 0.62). Bottom gusset ~9 cm deep.
- **Shape:** front and back panels puff out gently in the middle; edges stay flat. Flat heat-seal strip at the top (~1.5 cm). Thin side seals. Slightly rounded corners.
- **Textures:** front → `01`, back → `02`. Sides and bottom gusset: plain cream `#FDF8F4`. Top seal follows the red band.
- **Material:** matte paper-like (roughness ~0.75, no metal). Optional: the rice window area (approx. x 365–1300, y 1890–2325 px on the front texture) slightly glossier (roughness ~0.35) to look like clear film.
- **Brand colours (sampled from pack):** cream `#FDF8F4` · red `#B22C37` · green `#094233`.

## Build pipeline

1. **Model:** one Python script run with headless Blender
   `blender -b -P <script>.py -- --front 01-front-texture.png --back 02-back-texture.png --out pouch.glb`
   Script builds the mesh, UV-maps the front/back panels, applies materials, exports `.glb`.
2. **Check:** the same script renders small preview PNGs (front, 3/4, side, back) on CPU (Workbench or Cycles, low samples — no GPU needed). Compare with `03-shape-reference.jpg`.
3. **Compress:** `gltf-transform optimize` with Meshopt + WebP textures, max texture size 2048.
4. **Load:** drei `useGLTF` in React Three Fiber.

**Targets:** `.glb` under 1.5 MB · under 20k triangles · smooth on a normal laptop/phone.

## Rules

- Never call this product "organic".
- Back panel text uses only facts from the pack or jewarorganic.com.
