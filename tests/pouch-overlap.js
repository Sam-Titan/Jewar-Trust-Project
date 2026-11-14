// Pouch / text overlap check (Phase 4 fixes). Run against `just preview` with the Playwright MCP:
//   browser_run_code_unsafe { filename: "tests/pouch-overlap.js" }
// Opens the page with ?debug=pouch (the canvas then publishes the pouch's screen box as
// data-pouch-box), then at the hero and at every story step, at 1440×900 and 390×844, asserts
// that no visible text or image on the page overlaps that box. The page is turned into a plain
// Playwright test in Phase 5. Not formatted by Biome (it adds a `;` that the MCP runner rejects).
async (page) => {
  const URL = "http://localhost:4173/Jewar-Trust-Project/?debug=pouch";
  const SIZES = [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ];
  const STEPS = [0.085, 0.255, 0.425, 0.595, 0.765]; // middle of each of the 5 steps
  const END = 0.93; // end state ("Explore the product")
  const failures = [];
  const rows = [];

  // Visible text (per text node) and images, as screen rects.
  const collect = () =>
    page.evaluate(() => {
      const vw = innerWidth;
      const vh = innerHeight;
      const opacity = (el) => {
        let o = 1;
        for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
          const cs = getComputedStyle(e);
          if (cs.display === "none" || cs.visibility === "hidden") return 0;
          o *= Number(cs.opacity);
        }
        return o;
      };
      const skip = (el) => el.closest(".sr-only, canvas, [role=dialog], [role=status]");
      const out = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const el = n.parentElement;
        if (!n.textContent.trim() || !el || skip(el) || opacity(el) < 0.2) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        for (const r of range.getClientRects()) {
          if (
            r.width > 1 &&
            r.height > 1 &&
            r.bottom > 0 &&
            r.top < vh &&
            r.right > 0 &&
            r.left < vw
          ) {
            out.push({
              what: `text "${n.textContent.trim().slice(0, 28)}"`,
              x0: r.left,
              y0: r.top,
              x1: r.right,
              y1: r.bottom,
            });
          }
        }
      }
      for (const img of document.querySelectorAll("main img")) {
        const r = img.getBoundingClientRect();
        if (skip(img) || opacity(img) < 0.2) continue;
        if (r.width > 1 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw) {
          out.push({ what: `img "${img.alt}"`, x0: r.left, y0: r.top, x1: r.right, y1: r.bottom });
        }
      }
      return out;
    });

  const check = async (label, size) => {
    await page.waitForTimeout(2200); // scroll settles, pouch damps, callout fades
    const raw = await page.locator("canvas").first().getAttribute("data-pouch-box");
    if (!raw) {
      failures.push(`${size.width}×${size.height} ${label}: no data-pouch-box`);
      return;
    }
    const [bx0, by0, bx1, by1] = raw.split(",").map(Number);
    const items = await collect();
    let hits = 0;
    for (const it of items) {
      const overlap = it.x0 < bx1 && it.x1 > bx0 && it.y0 < by1 && it.y1 > by0;
      if (overlap) {
        hits++;
        failures.push(
          `${size.width}×${size.height} ${label}: ${it.what} overlaps pouch [${raw}] (text ${Math.round(it.x0)},${Math.round(it.y0)},${Math.round(it.x1)},${Math.round(it.y1)})`,
        );
      }
    }
    rows.push(
      `${size.width}×${size.height} ${label}: pouch [${raw}], ${items.length} items, ${hits} overlaps`,
    );
  };

  for (const size of SIZES) {
    await page.setViewportSize(size);
    await page.goto(URL);
    await page.waitForSelector("canvas[data-pouch-box]", { timeout: 15000 });
    await page.waitForSelector("[role=status]", { state: "detached", timeout: 15000 });
    await check("hero", size);

    const scrollTo = (p) =>
      page.evaluate((p) => {
        const s = document.getElementById("story");
        const top = s.getBoundingClientRect().top + scrollY;
        scrollTo(0, top + p * (s.offsetHeight - innerHeight));
      }, p);

    for (const [i, p] of STEPS.entries()) {
      await scrollTo(p);
      await check(`step ${i + 1}`, size);
    }
    await scrollTo(END);
    await check("end", size);
  }

  return { ok: failures.length === 0, failures, rows };
}
