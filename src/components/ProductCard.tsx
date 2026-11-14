import { Star } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { toast } from "sonner";
import { SizeToggle } from "@/components/SizeToggle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { product } from "@/data/product";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL } from "@/hooks/useWebGL";
import { useUi } from "@/store/ui";

// Own canvas, same three/r3f/drei chunk as the page canvas (D-039).
const ViewerCanvas = lazy(() => import("@/components/three/ViewerCanvas"));

const base = import.meta.env.BASE_URL;
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const demoToast = () => toast("This is a demo — checkout isn't live.");

function Viewer() {
  const webgl = useWebGL();
  const reduced = useReducedMotion();
  return (
    <div
      role="img"
      aria-label="Jewar Everyday Basmati Rice pouch. Drag sideways to turn it."
      className={`relative h-72 rounded-xl md:h-full md:min-h-[480px] ${webgl ? "bg-rice/40" : "bg-cream"}`}
    >
      {webgl ? (
        <Suspense fallback={null}>
          <ViewerCanvas reduced={reduced} />
        </Suspense>
      ) : (
        <div className="flex h-full items-center justify-center p-6">
          <img
            src={`${base}images/pouch-front.webp`}
            alt=""
            width={800}
            height={1000}
            className="max-h-full w-auto"
          />
        </div>
      )}
      {webgl && (
        <p
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs tracking-wide text-green/60"
        >
          Drag to turn
        </p>
      )}
    </div>
  );
}

export default function ProductCard() {
  const open = useUi((s) => s.cardOpen);
  const closeCard = useUi((s) => s.closeCard);
  const [sizeId, setSizeId] = useState<(typeof product.sizes)[number]["id"]>("1kg");
  const size = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0];

  // Unconfirmed values (null) are left out, not shown as fact (D-019).
  const specs: Array<[string, string | null]> = [
    ["Net wt", size.netWeight],
    ["Grain", product.grain],
    ["Origin", product.origin],
    ["Shelf life", product.shelfLife],
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeCard()}>
      <DialogContent>
        <div className="grid gap-4 p-4 md:grid-cols-2 md:gap-8 md:p-6">
          <Viewer />
          <div className="flex flex-col gap-5 pb-2 md:py-4 md:pr-8">
            <div className="flex flex-col gap-2">
              <DialogTitle className="font-heading text-3xl leading-tight text-green md:text-4xl">
                {product.name}
              </DialogTitle>
              <DialogDescription className="text-green/80">{product.tag}</DialogDescription>
              <p className="flex items-center gap-1.5 text-sm text-green/80">
                <Star aria-hidden="true" className="size-4 fill-red text-red" />
                {product.rating.value.toFixed(1)} ({product.rating.count} reviews)
              </p>
            </div>

            <SizeToggle value={sizeId} onChange={setSizeId} />

            <div aria-live="polite">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-heading text-3xl text-green">{rupees(size.price)}</span>
                <span className="text-green/60 line-through">{rupees(size.mrp)}</span>
                <span className="text-sm font-semibold text-red">{size.off}% off</span>
              </p>
              {"placeholder" in size && (
                <p className="mt-1 text-xs text-green/60">Demo price for this size.</p>
              )}
            </div>

            <p className="text-green/80">{product.description}</p>

            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
              {specs.map(([k, v]) =>
                v ? (
                  <div key={k} className="contents">
                    <dt className="text-green/60">{k}</dt>
                    <dd className="text-green">{v}</dd>
                  </div>
                ) : null,
              )}
            </dl>

            <ul className="flex flex-col gap-1 text-sm text-green/80">
              {product.shopperNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>

            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" className="w-full sm:flex-1" onClick={demoToast}>
                Add to Cart
              </Button>
              <Button className="w-full sm:flex-1" onClick={demoToast}>
                Buy Now
              </Button>
            </div>
          </div>
        </div>
        <Toaster />
      </DialogContent>
    </Dialog>
  );
}
