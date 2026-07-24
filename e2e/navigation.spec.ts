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
  // Segment switches are buttons (client-side router.push), not <a> — the
  // lower nav row carries a data-href so tests can still enumerate and
  // directly visit every segment route, same coverage as real links gave us.
  const links = nav.locator("[data-href]");
  // Auto-retrying instead of a one-shot .count(): this app streams an initial
  // Suspense fallback (see src/app/loading.tsx) before swapping in the real
  // nav, so a bare count() can race and read 0.
  await expect(links.first()).toBeVisible();
  const hrefs = await links.evaluateAll((buttons) => buttons.map((b) => b.getAttribute("data-href")));
  expect(hrefs.length).toBeGreaterThan(1);

  const otherHref = hrefs.find((href) => href && href !== `/seasons/${FIXTURE_SEGMENT}`);
  expect(otherHref).toBeTruthy();

  await nav.locator(`[data-href="${otherHref}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${otherHref}/?$`));
  await expect(page.locator("text=/\\d+ games/")).toBeVisible();

  // Confirm every other segment link also resolves to a real page (covers
  // the remaining links without repeated click/back races).
  for (const href of hrefs) {
    if (!href || href === otherHref) continue;
    await page.goto(href);
    await expect(page.locator("text=/\\d+ games/")).toBeVisible();
  }
});

test("browser back after switching segments lands cleanly, no push/resync loop", async ({ page }) => {
  await page.goto(`/seasons/${FIXTURE_SEGMENT}`);

  const nav = page.getByRole("navigation");
  const links = nav.locator("[data-href]");
  await expect(links.first()).toBeVisible();
  const hrefs = await links.evaluateAll((buttons) => buttons.map((b) => b.getAttribute("data-href")));
  const otherHref = hrefs.find((href) => href && href !== `/seasons/${FIXTURE_SEGMENT}`);
  expect(otherHref).toBeTruthy();

  await nav.locator(`[data-href="${otherHref}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${otherHref}/?$`));

  // Regression test for a race between the two effects in SeasonNavButtonRow:
  // one resyncs local state from the URL, the other pushes the URL from local
  // state. Back button changes the URL externally (not via a button click),
  // which used to make the push-effect fire off a stale, pre-resync value of
  // currSeasonSuffix and shove the URL right back to otherHref — then the two
  // effects would keep fighting and bounce the URL back and forth forever.
  //
  // A single toHaveURL assertion isn't a reliable check here: it auto-retries
  // and can land on a poll where the oscillating URL happens to match, even
  // though it flips away again immediately after. Count navigations instead —
  // but Next.js itself fires a benign second framenavigated event on any hard
  // navigation (goto, back/forward): a history.replaceState housekeeping call
  // that re-lands on the exact same path (trailing-slash normalization) and
  // has nothing to do with our nav component. Dedupe by canonical path so
  // that's tolerated, and only fail on an actual bounce to a *different* URL.
  const urlsAfterBack: string[] = [];
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) urlsAfterBack.push(frame.url());
  });

  await page.goBack();
  await page.waitForTimeout(1000);

  const distinctUrlsAfterBack = new Set(urlsAfterBack.map((url) => url.replace(/\/$/, "")));
  expect(distinctUrlsAfterBack.size).toBeLessThanOrEqual(1);
  expect(page.url()).toMatch(new RegExp(`/seasons/${FIXTURE_SEGMENT}/?$`));

  // Both the year button and the suffix button resolve to the same href
  // when the selected year matches the active season, so >1 element can
  // legitimately be aria-pressed at once now that year buttons also carry
  // a real href (needed for hover-preload). Assert they all agree instead
  // of assuming a single match.
  const selectedHrefs = await nav
    .locator(`[data-href][aria-pressed="true"]`)
    .evaluateAll((buttons) => buttons.map((b) => b.getAttribute("data-href")));
  expect(selectedHrefs.length).toBeGreaterThan(0);
  for (const href of selectedHrefs) {
    expect(href).toBe(`/seasons/${FIXTURE_SEGMENT}`);
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
