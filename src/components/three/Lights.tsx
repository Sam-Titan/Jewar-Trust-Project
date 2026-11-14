import { Environment, Lightformer } from "@react-three/drei";

// Warm key light so the paper matches the photo's cream (D-036).
const KEY_LIGHT_COLOR = "#FFF4E6";
const KEY_LIGHT_INTENSITY = 1.9;

// Procedural light only. No HDR file, nothing downloaded (D-033).
// Shared by the page canvas and the product-card canvas so both look the same.
export function Lights() {
  return (
    <>
      <Environment resolution={256} environmentIntensity={0.95}>
        <Lightformer form="rect" intensity={2.2} position={[0, 3, 4]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1} position={[-4, 1, 2]} scale={[3, 5, 1]} />
        <Lightformer form="rect" intensity={1} position={[4, 1, 2]} scale={[3, 5, 1]} />
        <Lightformer form="ring" intensity={0.6} position={[0, -2, 3]} scale={4} />
      </Environment>
      <directionalLight
        color={KEY_LIGHT_COLOR}
        position={[1.5, 2.5, 3]}
        intensity={KEY_LIGHT_INTENSITY}
      />
    </>
  );
}
