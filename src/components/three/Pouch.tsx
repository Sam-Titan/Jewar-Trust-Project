import { ContactShadows, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { type Group, MathUtils } from "three";
import { STORY_STEPS, stepFromProgress } from "@/lib/story";
import { useUi } from "@/store/ui";

const MODEL_URL = `${import.meta.env.BASE_URL}models/pouch.glb`;
const POUCH_HEIGHT = 0.29; // metres
const deg = MathUtils.degToRad;

// Pouch turn (y) for each story step, then the end state. Tuned by eye.
// 1 front · 2 three-quarter · 3 side/back · 4 front (badge visible) · 5 three-quarter
const STEP_ANGLES = [0, deg(40), deg(140), 0, deg(-40)];
const END_ANGLE = 0;
const DAMP = 3.5; // higher = snappier

// No Draco, Meshopt on.
useGLTF.preload(MODEL_URL, false, true);

export function Pouch({ animate }: { animate: boolean }) {
  const { scene } = useGLTF(MODEL_URL, false, true);
  const layout = useRef<Group>(null);
  const motion = useRef<Group>(null);
  const aspect = useThree((s) => s.size.width / s.size.height);
  const setModelReady = useUi((s) => s.setModelReady);
  const inStory = useRef(0); // 0 = hero, 1 = story (damped)

  useEffect(() => {
    setModelReady(true);
  }, [setModelReady]);

  const phone = aspect < 0.8;

  useFrame(({ clock }, delta) => {
    const g = motion.current;
    const l = layout.current;
    if (!g || !l) return;
    if (!animate) {
      g.position.y = 0;
      g.rotation.y = 0;
      return;
    }
    const t = clock.elapsedTime;
    const p = useUi.getState().storyProgress;
    const story = p > 0.004;

    inStory.current = MathUtils.damp(inStory.current, story ? 1 : 0, DAMP, delta);

    // Hero: slow float + gentle sway (D-031). Story: eased to a set angle per step.
    const sway = Math.sin(t * 0.45) * 0.42;
    const step = stepFromProgress(p);
    const angle = p >= STORY_STEPS.end ? END_ANGLE : STEP_ANGLES[step];
    g.rotation.y = MathUtils.damp(g.rotation.y, story ? angle : sway, DAMP, delta);
    g.position.y = Math.sin(t * 0.8) * 0.008;

    // Phone: bigger in the hero; in the story it sits higher so the callout fits below.
    const targetScale = phone ? MathUtils.lerp(1.15, 1, inStory.current) : 1;
    l.scale.setScalar(targetScale);
    l.position.y = phone ? inStory.current * 0.085 : 0;
  });

  return (
    <group ref={layout}>
      <group position={[0, -POUCH_HEIGHT / 2 + 0.01, 0]}>
        <group ref={motion}>
          <primitive object={scene} />
        </group>
      </group>
      <ContactShadows
        position={[0, -0.135, 0]}
        opacity={0.35}
        scale={0.8}
        blur={2.4}
        far={0.4}
        resolution={512}
        frames={animate ? Number.POSITIVE_INFINITY : 1}
      />
    </group>
  );
}
