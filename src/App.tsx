import { Suspense } from "react";
import { Loader } from "@/components/Loader";
import { Stage } from "@/components/Stage";
import { FarmStrip } from "@/components/sections/FarmStrip";
import { Footer } from "@/components/sections/Footer";
import { useWebGL } from "@/hooks/useWebGL";
import { ProductCard } from "@/lib/card";
import { useUi } from "@/store/ui";

export default function App() {
  const webgl = useWebGL();
  const cardRequested = useUi((s) => s.cardRequested);
  return (
    <main>
      {webgl && <Loader />}
      <Stage />
      <FarmStrip />
      <Footer />
      {cardRequested && (
        <Suspense fallback={null}>
          <ProductCard />
        </Suspense>
      )}
    </main>
  );
}
