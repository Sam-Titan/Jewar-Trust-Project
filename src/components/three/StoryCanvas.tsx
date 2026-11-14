import { useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { lazy, Suspense, useEffect } from "react";
import { NeutralToneMapping } from "three";
import { useUi } from "@/store/ui";
import { Lights } from "./Lights";
import { Pouch } from "./Pouch";

// r3f-perf is dev only; the DEV check lets the bundler drop it from production.
const Perf = import.meta.env.DEV
  ? lazy(() => import("r3f-perf").then((m) => ({ default: m.Perf })))
  : null;

// Copies drei's load progress into our store, so the Loader (main chunk) needs no drei.
function ProgressBridge() {
  const progress = useProgress((s) => s.progress);
  const setProgress = useUi((s) => s.setProgress);
  useEffect(() => {
    setProgress(progress);
  }, [progress, setProgress]);
  return null;
}

export default function StoryCanvas({ animate }: { animate: boolean }) {
  // The card has its own canvas, so the page canvas rests while it is open (D-018).
  const cardOpen = useUi((s) => s.cardOpen);
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 1.2], fov: 30 }}
      gl={{ alpha: true, antialias: true }}
      frameloop={animate && !cardOpen ? "always" : "demand"}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ProgressBridge />
      <Lights />
      <Suspense fallback={null}>
        <Pouch animate={animate} />
      </Suspense>
      {Perf && (
        <Suspense fallback={null}>
          <Perf position="top-left" />
        </Suspense>
      )}
    </Canvas>
  );
}
