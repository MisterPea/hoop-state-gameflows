import { expect, test } from "@playwright/test";
import { FIXTURE_SEGMENT } from "./fixtures";

test("home redirects to the first season segment", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/seasons\/.+/);
  await expect(page.getByRole("navigation")).toBeVisible();
});

test("season nav switches segments", async ({ page }) => {
  await page.goto(`/seasons/${FIXTURE_SEGMENT}`);

  const nav = page.getByRole("navigation");
  const links = nav.getByRole("link");
  // Auto-retrying instead of a one-shot .count(): this app streams an initial
  // Suspense fallback (see src/app/loading.tsx) before swapping in the real
  // nav, so a bare count() can race and read 0.
  await expect(links.first()).toBeVisible();
  const hrefs = await links.evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href")));
  expect(hrefs.length).toBeGreaterThan(1);

  const otherHref = hrefs.find((href) => href && href !== `/seasons/${FIXTURE_SEGMENT}`);
  expect(otherHref).toBeTruthy();

  await nav.locator(`a[href="${otherHref}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${otherHref}$`));
  await expect(page.locator("text=/\\d+ games/")).toBeVisible();

  // Confirm every other segment link also resolves to a real page (covers
  // the remaining links without repeated click/back races).
  for (const href of hrefs) {
    if (!href || href === otherHref) continue;
    await page.goto(href);
    await expect(page.locator("text=/\\d+ games/")).toBeVisible();
  }
});

test("unknown season segment renders not-found page", async ({ page }) => {
  const response = await page.goto("/seasons/not-a-real-segment");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Hoop State Gameflows/i })).toBeVisible();
});

test("unknown game id renders not-found page", async ({ page }) => {
  const response = await page.goto("/games/not-a-real-game-id");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});
