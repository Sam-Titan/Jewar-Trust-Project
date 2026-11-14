import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { product } from "@/data/product";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { STORY_STEPS, stepFromProgress } from "@/lib/story";
import { useUi } from "@/store/ui";

const base = import.meta.env.BASE_URL;

function Badge({ className }: { className?: string }) {
  return (
    <img
      src={`${base}images/trust-badge.webp`}
      alt="Tested for 900+ pesticides"
      width={385}
      height={247}
      className={className}
    />
  );
}

export function ScrollStory() {
  const reduced = useReducedMotion();
  return reduced ? <StoryList /> : <StoryScroll />;
}

// Reduced motion: a plain list, no sticky, no scroll-linked motion.
function StoryList() {
  return (
    <section id="story" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="font-heading text-3xl text-green sm:text-4xl">What makes it Jewar</h2>
      <ol className="mt-10 flex flex-col gap-10">
        {product.properties.map((p, i) => (
          <li key={p.title} className="flex flex-col gap-3">
            <span className="text-sm font-semibold tracking-[0.2em] text-red">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-heading text-2xl text-green">{p.title}</h3>
            <p className="text-green/80">{p.line}</p>
            {"badge" in p && <Badge className="w-40" />}
          </li>
        ))}
      </ol>
      {/* Phase 4: open the product card */}
      <Button className="mt-12">Explore the product</Button>
    </section>
  );
}

function StoryScroll() {
  const ref = useRef<HTMLElement>(null);
  const desktop = useMediaQuery("(min-width: 768px)");
  const [step, setStep] = useState(0);
  const [ended, setEnded] = useState(false);
  const setStoryProgress = useUi((s) => s.setStoryProgress);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setStoryProgress(p);
    setStep(stepFromProgress(p));
    setEnded(p >= STORY_STEPS.end);
  });

  // Leaving the story (or unmounting) puts the pouch back to the hero state.
  useEffect(() => () => setStoryProgress(0), [setStoryProgress]);

  const current = product.properties[step];
  const left = step % 2 === 0;
  const dx = desktop ? (left ? -48 : 48) : 0;
  const dy = desktop ? 0 : 24;

  return (
    <section id="story" ref={ref} className="relative h-[400svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* All five, for screen readers; the visible callouts below are decorative copies. */}
        <ol className="sr-only">
          {product.properties.map((p) => (
            <li key={p.title}>
              {p.title}. {p.line}
            </li>
          ))}
        </ol>

        <div className="relative mx-auto h-full max-w-6xl px-6" aria-hidden="true">
          <AnimatePresence mode="wait">
            {!ended && (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: dx, y: dy }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -dx / 2, y: -dy / 2 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className={
                  desktop
                    ? `absolute top-1/2 w-80 -translate-y-1/2 ${left ? "left-6" : "right-6"}`
                    : "absolute inset-x-6 bottom-[9svh] text-center"
                }
              >
                <div
                  className={`flex flex-col gap-3 ${desktop ? "" : "items-center"} ${desktop && !left ? "items-end text-right" : ""}`}
                >
                  <span className="text-sm font-semibold tracking-[0.2em] text-red">
                    {String(step + 1).padStart(2, "0")} / 05
                  </span>
                  {"badge" in current && <Badge className="w-36 sm:w-44" />}
                  <h2 className="font-heading text-2xl leading-tight text-green sm:text-4xl">
                    {current.title}
                  </h2>
                  <p className="text-base text-green/80 sm:text-lg">{current.line}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step dots */}
        {!ended && (
          <div
            className="absolute inset-x-0 bottom-[4svh] flex justify-center gap-2"
            aria-hidden="true"
          >
            {product.properties.map((p, i) => (
              <span
                key={p.title}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-red" : "w-1.5 bg-green/25"}`}
              />
            ))}
          </div>
        )}

        <AnimatePresence>
          {ended && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-x-6 bottom-[9svh] flex flex-col items-center gap-4 text-center"
            >
              <h2 className="font-heading text-2xl text-green sm:text-4xl">{product.name}</h2>
              <p className="text-green/80">{product.tag}</p>
              {/* Phase 4: open the product card */}
              <Button>Explore the product</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
