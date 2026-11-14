import { lazy } from "react";
import { webglSupported } from "@/hooks/useWebGL";

// The whole product card (Dialog, sonner, viewer) is one lazy chunk. Nothing in the main
// bundle imports it statically (D-039).
const load = () => import("@/components/ProductCard");
export const ProductCard = lazy(load);
/** Start the download early, e.g. when the button is hovered or focused. */
export const prefetchCard = () => {
  void load();
  // No WebGL means no 3D chunk at all (D-035).
  if (webglSupported) void import("@/components/three/ViewerCanvas");
};
