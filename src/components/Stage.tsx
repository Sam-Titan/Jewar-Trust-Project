import { lazy, Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { ScrollStory } from "@/components/sections/ScrollStory";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL } from "@/hooks/useWebGL";

// The 3D code (three, r3f, drei, pouch) is its own chunk, so text and loader paint first (D-035).
const StoryCanvas = lazy(() => import("@/components/three/StoryCanvas"));

/**
 * Hero + scroll story share one canvas. The canvas layer is sticky, so the pouch stays on screen
 * while the story scrolls, and leaves with the wrapper when the farm strip arrives.
 * Reduced motion: the layer is not sticky; it only sits behind the hero (a still pouch).
 */
export function Stage() {
  const reduced = useReducedMotion();
  const webgl = useWebGL();
  const base = import.meta.env.BASE_URL;

  return (
    <div className="relative">
      <div
        aria-hidden={webgl ? true : undefined}
        className={
          reduced
            ? "pointer-events-none absolute inset-x-0 top-0 z-0 h-svh"
            : "pointer-events-none sticky top-0 z-0 h-svh"
        }
      >
        {webgl ? (
          <Suspense fallback={null}>
            <StoryCanvas animate={!reduced} />
          </Suspense>
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
      <div className={reduced ? "relative z-10" : "relative z-10 -mt-[100svh]"}>
        <Hero />
        <ScrollStory />
      </div>
    </div>
  );
}
