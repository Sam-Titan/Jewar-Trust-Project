import { ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { type Group, MathUtils, NeutralToneMapping, PerspectiveCamera } from "three";
import { MODEL_URL, POUCH_HEIGHT } from "@/lib/model";
import { Lights } from "./Lights";

const IDLE_MS = 2000; // wait this long after a drag, then turn back to the front
const RESET_DAMP = 3;

function Viewer({ reduced }: { reduced: boolean }) {
  const { scene } = useGLTF(MODEL_URL, false, true);
  // Clone: the page pouch uses the cached scene, and one Object3D can only have one parent.
  // Geometry and materials are shared, so this costs almost nothing.
  const pouch = useMemo(() => scene.clone(), [scene]);
  const dragging = useRef(false);
  const lastEnd = useRef(Number.NEGATIVE_INFINITY);
  const pivot = useRef<Group>(null);
  // OrbitControls drives this hidden camera, not the real one. We turn the pouch by its azimuth
  // instead, so the lights stay on the pouch's visible side (orbiting the real camera left the
  // lights behind and the side of the pouch went black).
  const orbitCam = useMemo(() => {
    const cam = new PerspectiveCamera();
    cam.position.set(0, 0, 1);
    return cam;
  }, []);
  const canvas = useThree((s) => s.gl.domElement);

  useFrame((_, delta) => {
    // OrbitControls sets touch-action: none on the canvas and r3f sets it on its wrapper div
    // (both are re-applied on reconnect). The effective value is the intersection down the
    // tree, so every "none" up to the dialog must become pan-y: a vertical swipe then scrolls
    // the card, while a sideways drag still turns the pouch.
    const stop = canvas.closest("[role=dialog]");
    for (let el: HTMLElement | null = canvas; el && el !== stop; el = el.parentElement) {
      if (el === canvas || el.style.touchAction === "none") el.style.touchAction = "pan-y";
    }
    if (dragging.current || performance.now() - lastEnd.current < IDLE_MS) return;
    const { x, z } = orbitCam.position;
    const az = Math.atan2(x, z);
    if (Math.abs(az) < 0.001) return;
    const r = Math.hypot(x, z);
    const next = reduced ? 0 : MathUtils.damp(az, 0, RESET_DAMP, delta);
    orbitCam.position.x = r * Math.sin(next);
    orbitCam.position.z = r * Math.cos(next);
  });

  useFrame(() => {
    if (pivot.current)
      pivot.current.rotation.y = -Math.atan2(orbitCam.position.x, orbitCam.position.z);
  });

  return (
    <>
      <OrbitControls
        camera={orbitCam}
        enableZoom={false}
        enablePan={false}
        enableDamping
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        onStart={() => {
          dragging.current = true;
        }}
        onEnd={() => {
          dragging.current = false;
          lastEnd.current = performance.now();
        }}
      />
      <group position={[0, -POUCH_HEIGHT / 2 + 0.01, 0]}>
        <group ref={pivot}>
          <primitive object={pouch} />
        </group>
      </group>
      <ContactShadows
        position={[0, -0.135, 0]}
        opacity={0.35}
        scale={0.8}
        blur={2.4}
        far={0.4}
        resolution={256}
      />
    </>
  );
}

export default function ViewerCanvas({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 0.8], fov: 30 }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Lights />
      <Suspense fallback={null}>
        <Viewer reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
