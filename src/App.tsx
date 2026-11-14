import { Loader } from "@/components/Loader";
import { Hero } from "@/components/sections/Hero";
import { useWebGL } from "@/hooks/useWebGL";

export default function App() {
  const webgl = useWebGL();
  return (
    <main>
      {webgl && <Loader />}
      <Hero />
    </main>
  );
}
