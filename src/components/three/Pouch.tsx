import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import { useUi } from "@/store/ui";

const MODEL_URL = `${import.meta.env.BASE_URL}models/pouch.glb`;
const POUCH_HEIGHT = 0.29; // metres

// No Draco, Meshopt on.
useGLTF.preload(MODEL_URL, false, true);

export function Pouch({ animate }: { animate: boolean }) {
  const { scene } = useGLTF(MODEL_URL, false, true);
  const motion = useRef<Group>(null);
  const aspect = useThree((s) => s.size.width / s.size.height);
  const setModelReady = useUi((s) => s.setModelReady);

  useEffect(() => {
    setModelReady(true);
  }, [setModelReady]);

  // Slow float + gentle sway (not a full spin, so the front stays readable).
  useFrame(({ clock }) => {
    const g = motion.current;
    if (!g) return;
    if (!animate) {
      g.position.y = 0;
      g.rotation.y = 0;
      return;
    }
    const t = clock.elapsedTime;
    g.position.y = Math.sin(t * 0.8) * 0.008;
    g.rotation.y = Math.sin(t * 0.45) * 0.42;
  });

  // Bigger on tall phone screens, where there is spare height.
  const scale = aspect < 0.8 ? 1.15 : 1;

  return (
    <group position={[0, -POUCH_HEIGHT / 2 + 0.01, 0]} scale={scale}>
      <group ref={motion}>
        <primitive object={scene} />
      </group>
    </group>
  );
}
