import { expect, test } from "@playwright/test";
import { FIXTURE_SEGMENT } from "./fixtures";

test.describe("season segment page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/seasons/${FIXTURE_SEGMENT}`);
  });

  test("header game count matches the fetched season json, but only a virtualized window is mounted", async ({
    page,
    request,
    baseURL,
  }) => {
    const gamesByDate = await request
      .get(`${baseURL}/data/season-games/${FIXTURE_SEGMENT}.json`)
      .then((res) => res.json());
    const expectedCount = Object.values(gamesByDate).flat().length;

    const headerText = await page.locator("header p").first().textContent();
    const headerCount = Number(headerText?.match(/(\d+) games/)?.[1]);
    expect(headerCount).toBe(expectedCount);

    // Virtualization means the DOM only ever holds the visible window
    // (plus overscan) of game cards, not the whole season.
    const cardCount = await page.locator('a[href^="/games/"]').count();
    expect(cardCount).toBeGreaterThan(0);
    expect(cardCount).toBeLessThan(expectedCount);
  });

  test("scrolling to the bottom mounts the earliest date's games", async ({
    page,
    request,
    baseURL,
  }) => {
    const gamesByDate = await request
      .get(`${baseURL}/data/season-games/${FIXTURE_SEGMENT}.json`)
      .then((res) => res.json());
    const dates = Object.keys(gamesByDate);
    const earliestDateGameId = gamesByDate[dates[dates.length - 1]][0].gameId;

    // Retry rather than a single scrollTo: the virtualizer's window-scroll
    // listener attaches on hydration, which can race a scroll issued right
    // after navigation and snap it back to the top, and the estimated total
    // height also keeps growing as more sections get measured. Re-issuing
    // the scroll converges on the true bottom either way.
    const earliestCard = page.locator(`a[href*="${earliestDateGameId}"]`);
    await expect(async () => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(earliestCard).toBeVisible();
    }).toPass();
  });

  test("game card opens the game page in a new tab", async ({
    page,
    context,
  }) => {
    const card = page.locator('a[href^="/games/"]').first();
    const href = await card.getAttribute("href");
    await expect(card).toHaveAttribute("target", "_blank");

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      card.click(),
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain(href);
    // Scoped past the site header's own <h1> ("Hoop State").
    await expect(newPage.locator('[class$="gameTitle"] h1')).toBeVisible();
  });

  test("renders on mobile viewport without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
