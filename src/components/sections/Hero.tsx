import { ChevronDown } from "lucide-react";
import { StoryCanvas } from "@/components/three/StoryCanvas";
import { product } from "@/data/product";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL } from "@/hooks/useWebGL";

export function Hero() {
  const reduced = useReducedMotion();
  const webgl = useWebGL();
  const base = import.meta.env.BASE_URL;

  return (
    <section className="relative isolate h-svh min-h-[560px] overflow-hidden">
      <div className="absolute inset-0">
        {webgl ? (
          <StoryCanvas animate={!reduced} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <img
              src={`${base}images/pouch-front.webp`}
              alt="Jewar Everyday Basmati Rice pouch"
              width={800}
              height={1000}
              className="max-h-[55svh] w-auto"
            />
          </div>
        )}
      </div>

      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-between px-6 py-8 text-center sm:py-12">
        <img
          src={`${base}images/wordmark.webp`}
          alt="Jewar"
          width={1692}
          height={410}
          className="w-40 sm:w-56"
        />
        <div className="flex flex-col items-center gap-5">
          <p className="max-w-md font-heading text-xl leading-snug text-green sm:max-w-xl sm:text-3xl">
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
      </div>
    </section>
  );
}
