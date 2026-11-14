set shell := ["bash", "-cu"]

default:
    @just --list

setup:
    pnpm install
    pnpm exec lefthook install

dev:
    pnpm dev --host

check:
    pnpm exec biome check .
    pnpm exec tsc -b --noEmit

fix:
    pnpm exec biome check --write .

build:
    pnpm build

# Serves dist/ at http://localhost:4173/Jewar-Trust-Project/
preview:
    pnpm exec vite preview

# Blender (headless): raw .glb + preview renders + pouch-front.webp
model:
    blender -b -P blender/build_pouch.py -- --front assets/reference/01-front-texture.png --back assets/reference/02-back-texture.png --out blender/out/pouch-raw.glb

# Compress the raw model into public/models/pouch.glb
optimize:
    mkdir -p public/models
    pnpm exec gltf-transform optimize blender/out/pouch-raw.glb public/models/pouch.glb --compress meshopt --texture-compress webp --texture-size 2048 --simplify false
    pnpm exec gltf-transform inspect public/models/pouch.glb
    ls -l public/models/pouch.glb

# Stubs until later phases
test:
    @echo "Not built yet (Phase 5)."

lh:
    @echo "Not built yet (Phase 5)."
