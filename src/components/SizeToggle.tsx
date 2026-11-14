import { product } from "@/data/product";

type SizeId = (typeof product.sizes)[number]["id"];

// Native radios (arrow keys, focus and screen readers work for free), styled as a pill toggle.
export function SizeToggle({ value, onChange }: { value: SizeId; onChange: (id: SizeId) => void }) {
  return (
    <fieldset className="inline-flex w-fit rounded-full bg-rice/60 p-1">
      <legend className="sr-only">Size</legend>
      {product.sizes.map((s) => (
        <label key={s.id} className="relative cursor-pointer">
          <input
            type="radio"
            name="size"
            value={s.id}
            checked={value === s.id}
            onChange={() => onChange(s.id)}
            className="peer sr-only"
          />
          <span className="flex h-10 min-w-20 items-center justify-center rounded-full px-5 text-sm font-semibold text-green transition-colors hover:bg-rice peer-checked:bg-green peer-checked:text-cream peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-green">
            {s.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
