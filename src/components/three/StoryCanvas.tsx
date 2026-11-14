import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { lazy, Suspense } from "react";
import { NeutralToneMapping } from "three";
import { Pouch } from "./Pouch";

// r3f-perf is dev only; the DEV check lets the bundler drop it from production.
const Perf = import.meta.env.DEV
  ? lazy(() => import("r3f-perf").then((m) => ({ default: m.Perf })))
  : null;

export function StoryCanvas({ animate }: { animate: boolean }) {
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
      {/* Procedural light only. No HDR file, nothing downloaded (D-033). */}
      <Environment resolution={256} environmentIntensity={0.95}>
        <Lightformer form="rect" intensity={2.2} position={[0, 3, 4]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1} position={[-4, 1, 2]} scale={[3, 5, 1]} />
        <Lightformer form="rect" intensity={1} position={[4, 1, 2]} scale={[3, 5, 1]} />
        <Lightformer form="ring" intensity={0.6} position={[0, -2, 3]} scale={4} />
      </Environment>
      <directionalLight position={[1.5, 2.5, 3]} intensity={1.4} />
      <Suspense fallback={null}>
        <Pouch animate={animate} />
      </Suspense>
      <ContactShadows
        position={[0, -0.135, 0]}
        opacity={0.35}
        scale={0.8}
        blur={2.4}
        far={0.4}
        resolution={512}
        frames={animate ? Number.POSITIVE_INFINITY : 1}
      />
      {Perf && (
        <Suspense fallback={null}>
          <Perf position="top-left" />
        </Suspense>
      )}
    </Canvas>
  );
}
