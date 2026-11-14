import type { CSSProperties } from "react";
import { Toaster as Sonner } from "sonner";

// Cream toast with green text, matching the page. No theme provider needed.
export function Toaster() {
  return (
    <Sonner
      position="top-center"
      style={
        {
          "--normal-bg": "var(--color-cream)",
          "--normal-text": "var(--color-green)",
          "--normal-border": "var(--color-rice)",
          fontFamily: "var(--font-body)",
        } as CSSProperties
      }
    />
  );
}
