import { expect, test } from "@playwright/test";

// Smoke test: page loads, story scrolls, card opens, toast shows.
test("page loads, story scrolls, card opens, toast shows", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  await page.goto("./");
  await expect(page.getByRole("img", { name: "Jewar Organic logo" }).first()).toBeVisible();
  await expect(page.locator("canvas").first()).toBeVisible();

  // Story: scroll in steps; the first and last property titles must show up.
  // Visible callouts are aria-hidden (an sr-only list covers screen readers), so match on text.
  const title = (t: string) => page.locator("#story h2", { hasText: t });
  const story = page.locator("#story");
  const top = await story.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const height = await story.evaluate((el) => (el as HTMLElement).offsetHeight);
  const view = page.viewportSize()?.height ?? 900;
  await page.evaluate((y) => window.scrollTo(0, y), top + 10);
  await expect(title("Long grain")).toBeVisible();
  await page.evaluate((y) => window.scrollTo(0, y), top + (height - view) * 0.8);
  await expect(title("Handpicked by our family")).toBeVisible();

  // End state: open the product card.
  await page.evaluate((y) => window.scrollTo(0, y), top + height - view);
  await page.getByRole("button", { name: "Explore the product" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // Add to Cart shows the demo toast.
  await dialog.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByText("This is a demo — checkout isn't live.")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  expect(errors).toEqual([]);
});

test("reduced motion shows the plain list", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "What makes it Jewar" })).toBeVisible();
});
