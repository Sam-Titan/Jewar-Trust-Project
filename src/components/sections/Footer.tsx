import { product } from "@/data/product";

export function Footer() {
  return (
    <footer className="bg-rice/40 px-6 py-12 text-center">
      <ul className="flex flex-col items-center justify-center gap-2 text-sm text-green sm:flex-row sm:gap-8">
        {product.shopperNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center gap-6 text-sm font-semibold">
        <a
          href={product.socials.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded px-1 text-green underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
        >
          Facebook
        </a>
        <a
          href={product.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded px-1 text-green underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
        >
          Instagram
        </a>
      </div>
      <p className="mt-8 text-xs text-green/70">Demo by Swayam Bansal</p>
    </footer>
  );
}
