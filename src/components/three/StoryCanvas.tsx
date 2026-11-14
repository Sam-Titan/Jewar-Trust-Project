import { Environment, Lightformer, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { lazy, Suspense, useEffect } from "react";
import { NeutralToneMapping } from "three";
import { useUi } from "@/store/ui";
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

// Warm key light so the paper matches the photo's cream (D-036).
const KEY_LIGHT_COLOR = "#FFF4E6";

export default function StoryCanvas({ animate }: { animate: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 1.2], fov: 30 }}
      gl={{ alpha: true, antialias: true }}
      frameloop={animate ? "always" : "demand"}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ProgressBridge />
      {/* Procedural light only. No HDR file, nothing downloaded (D-033). */}
      <Environment resolution={256} environmentIntensity={0.95}>
        <Lightformer form="rect" intensity={2.2} position={[0, 3, 4]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1} position={[-4, 1, 2]} scale={[3, 5, 1]} />
        <Lightformer form="rect" intensity={1} position={[4, 1, 2]} scale={[3, 5, 1]} />
        <Lightformer form="ring" intensity={0.6} position={[0, -2, 3]} scale={4} />
      </Environment>
      <directionalLight color={KEY_LIGHT_COLOR} position={[1.5, 2.5, 3]} intensity={1.4} />
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
