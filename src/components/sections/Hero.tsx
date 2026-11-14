import { ChevronDown } from "lucide-react";
import { product } from "@/data/product";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Wide screens: text zone on the left, pouch on the right (drawn by the 3D canvas).
// Portrait screens: pouch in the top half, text zone below it, scroll hint at the bottom.
export function Hero() {
  const reduced = useReducedMotion();
  const base = import.meta.env.BASE_URL;

  return (
    <section className="relative h-svh overflow-hidden">
      <header className="absolute inset-x-0 top-0 z-20 flex justify-center px-6 py-3 wide:justify-start wide:px-12 wide:py-5 lg:wide:px-20">
        <img
          src={`${base}images/jewar-logo.webp`}
          alt="Jewar Organic logo"
          width={387}
          height={417}
          className="h-12 w-auto wide:h-14"
        />
      </header>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-[44svh] flex-col items-center justify-between px-6 pt-4 pb-8 text-center wide:inset-y-0 wide:right-auto wide:h-auto wide:w-[44%] wide:items-start wide:justify-center wide:gap-10 wide:px-12 wide:py-0 wide:text-left lg:wide:px-20">
        <p className="max-w-md font-heading text-xl leading-snug text-green sm:text-3xl wide:max-w-lg wide:text-4xl">
          {product.brandLine}
        </p>
        <a
          href="#story"
          className="pointer-events-auto flex flex-col items-center gap-1 rounded-full px-3 py-1 text-xs tracking-[0.2em] text-green/70 uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
        >
          Scroll
          <ChevronDown
            aria-hidden="true"
            className={reduced ? "size-5" : "size-5 motion-safe:animate-bounce"}
          />
        </a>
      </div>
    </section>
  );
}
