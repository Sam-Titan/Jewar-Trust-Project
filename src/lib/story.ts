// Story timing. Progress 0–STEPS_END is split into 5 equal steps;
// STEPS_END–1 is the end state (pouch front, "Explore the product").
// Plain TS, no three.js: this file is used by the main chunk and the 3D chunk.
export const STORY_STEPS = { count: 5, end: 0.85 } as const;

export function stepFromProgress(p: number) {
  const raw = Math.floor((p / STORY_STEPS.end) * STORY_STEPS.count);
  return Math.min(STORY_STEPS.count - 1, Math.max(0, raw));
}
