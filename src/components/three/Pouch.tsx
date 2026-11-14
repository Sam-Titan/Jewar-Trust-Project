import { ContactShadows, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Box3, type Group, MathUtils, Vector3 } from "three";
import { MODEL_URL, POUCH_HEIGHT } from "@/lib/model";
import { STORY_STEPS, stepFromProgress } from "@/lib/story";
import { useUi } from "@/store/ui";

const deg = MathUtils.degToRad;

// Pouch turn (y) for each story step, then the end state. Tuned by eye.
// 1 front · 2 three-quarter · 3 side/back · 4 front (badge visible) · 5 three-quarter
const STEP_ANGLES = [0, deg(40), deg(140), 0, deg(-40)];
const END_ANGLE = 0;
const DAMP = 3.5; // higher = snappier

// Where the pouch sits, as a share of the visible width/height (SPEC § 2).
// Wide screens: hero pouch on the right (text on the left), damped to the centre for the story.
// Portrait screens (aspect < 1): hero pouch in the top half, story pouch a little higher so the
// callout fits below it.
const HERO_X = 0.22; // × viewport width, wide screens
const HERO_Y_PORTRAIT = 0.17; // × viewport height
const STORY_Y_PORTRAIT = 0.13;
const HERO_SCALE_PORTRAIT = 0.9;

// Test hook: with ?debug=pouch the canvas gets data-pouch-box (the pouch's screen box, CSS px),
// used by tests/pouch-overlap.js to check that no text overlaps the pouch.
const DEBUG_BOX = new URLSearchParams(window.location.search).get("debug") === "pouch";
const corner = new Vector3();
const bounds = new Box3();

// No Draco, Meshopt on.
useGLTF.preload(MODEL_URL, false, true);

export function Pouch({ animate }: { animate: boolean }) {
  const { scene } = useGLTF(MODEL_URL, false, true);
  const layout = useRef<Group>(null);
  const motion = useRef<Group>(null);
  const setModelReady = useUi((s) => s.setModelReady);
  const inStory = useRef(0); // 0 = hero, 1 = story (damped)

  useEffect(() => {
    setModelReady(true);
  }, [setModelReady]);

  useFrame((state, delta) => {
    const { clock, viewport, size, camera, gl } = state;
    const g = motion.current;
    const l = layout.current;
    if (!g || !l) return;

    // Position and size on screen. `k` = 0 in the hero, 1 in the story.
    const portrait = size.width / size.height < 1;
    const place = (k: number) => {
      l.scale.setScalar(portrait ? MathUtils.lerp(HERO_SCALE_PORTRAIT, 1, k) : 1);
      l.position.x = portrait ? 0 : MathUtils.lerp(HERO_X * viewport.width, 0, k);
      l.position.y = portrait
        ? MathUtils.lerp(HERO_Y_PORTRAIT, STORY_Y_PORTRAIT, k) * viewport.height
        : 0;
    };
    const reportBox = () => {
      if (!DEBUG_BOX) return;
      l.updateMatrixWorld(true);
      bounds.setFromObject(g);
      const r = gl.domElement.getBoundingClientRect();
      let x0 = Number.POSITIVE_INFINITY;
      let y0 = Number.POSITIVE_INFINITY;
      let x1 = Number.NEGATIVE_INFINITY;
      let y1 = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < 8; i++) {
        corner.set(
          i & 1 ? bounds.max.x : bounds.min.x,
          i & 2 ? bounds.max.y : bounds.min.y,
          i & 4 ? bounds.max.z : bounds.min.z,
        );
        corner.project(camera);
        const x = r.left + ((corner.x + 1) / 2) * r.width;
        const y = r.top + ((1 - corner.y) / 2) * r.height;
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
      gl.domElement.dataset.pouchBox = [x0, y0, x1, y1].map(Math.round).join(",");
    };

    if (!animate) {
      g.position.y = 0;
      g.rotation.y = 0;
      place(0);
      reportBox();
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

    place(inStory.current);
    reportBox();
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
