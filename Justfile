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

# Stubs until later phases
model:
    @echo "Not built yet (Phase 1)."

optimize:
    @echo "Not built yet (Phase 1)."

test:
    @echo "Not built yet (Phase 5)."

lh:
    @echo "Not built yet (Phase 5)."
