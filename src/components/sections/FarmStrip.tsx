import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { product } from "@/data/product";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function FarmStrip() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={ref} className="overflow-hidden px-0 py-16 sm:py-24">
      {/* Image is 130% wide and centred; the shift stays inside the 15% overhang. */}
      <motion.img
        src={`${import.meta.env.BASE_URL}images/farm-strip.webp`}
        alt=""
        width={1692}
        height={420}
        style={reduced ? undefined : { x }}
        className="-ml-[15%] h-auto w-[130%] max-w-none will-change-transform"
      />
      <p className="mx-auto mt-10 max-w-xl px-6 text-center font-heading text-2xl leading-snug text-green sm:text-3xl">
        {product.familyLine}
      </p>
    </section>
  );
}
