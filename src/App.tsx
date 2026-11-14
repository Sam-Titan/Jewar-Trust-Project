import { Loader } from "@/components/Loader";
import { Stage } from "@/components/Stage";
import { FarmStrip } from "@/components/sections/FarmStrip";
import { Footer } from "@/components/sections/Footer";
import { useWebGL } from "@/hooks/useWebGL";

export default function App() {
  const webgl = useWebGL();
  return (
    <main>
      {webgl && <Loader />}
      <Stage />
      <FarmStrip />
      <Footer />
    </main>
  );
}
