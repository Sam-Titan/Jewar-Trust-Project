import { AnimatePresence, motion } from "motion/react";
import { useUi } from "@/store/ui";

export function Loader() {
  const ready = useUi((s) => s.modelReady);
  const progress = useUi((s) => s.progress);
  const base = import.meta.env.BASE_URL;

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="loader"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-cream"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={`${base}images/wordmark.webp`}
            alt="Jewar"
            width={1692}
            height={410}
            className="w-56 max-w-[70vw]"
          />
          <div className="h-1 w-40 overflow-hidden rounded-full bg-rice">
            <div
              className="h-full rounded-full bg-red transition-[width] duration-300"
              style={{ width: `${Math.max(8, progress)}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
