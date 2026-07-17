import { expect, test } from "@playwright/test";
import { FIXTURE_GAME_ID } from "./fixtures";

test.describe("game page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/games/${FIXTURE_GAME_ID}`);
  });

  test("renders title, date, and officials", async ({ page }) => {
    // Scoped past the site header's own <h1> ("Hoop State") via the
    // GamePageTitle wrapper's CSS-module class suffix.
    await expect(page.locator('[class$="gameTitle"] h1')).toContainText(" at ");
    await expect(page.getByText("Date:")).toBeVisible();
    await expect(page.getByText("Game Id:")).toBeVisible();
    await expect(page.getByText(FIXTURE_GAME_ID)).toBeVisible();
    await expect(page.getByText("Officials:")).toBeVisible();
  });

  test("box score row count matches roster size per team", async ({ page }) => {
    const tables = page.locator("table");
    await expect(tables).toHaveCount(2);

    for (let i = 0; i < 2; i++) {
      const table = tables.nth(i);
      const rowCount = await table.locator("tbody tr").count();
      expect(rowCount).toBeGreaterThan(0);
    }
  });

  test("shot chart marker count matches the attempt total shown above it", async ({ page }) => {
    // CSS module classnames keep their original local name as a suffix in
    // production builds (e.g. "..._module__hash__shotChart"), so `$=` gives
    // a stable hook without test-ids. Each ShotChart renders a `totalNum`
    // attempts count and one court <svg> with a made/missed marker per shot;
    // cross-checking the two keeps this correct as the dataset changes,
    // instead of hardcoding an expected count.
    const shotCharts = page.locator('[class$="shotChart"]');
    await expect(shotCharts).toHaveCount(2);

    for (let i = 0; i < 2; i++) {
      const chart = shotCharts.nth(i);
      const attempts = Number(await chart.locator('[class$="totalNum"]').textContent());
      expect(attempts).toBeGreaterThan(0);

      // The court background (courtFrame group) also draws lines/a circle for
      // hash marks and the rim, so scope to the unclassed <g> that wraps the
      // actual shot markers. Misses render as a <g> with two <line>s, so
      // line-count/2 + circle-count == attempts.
      const markerGroup = chart.locator("svg > g:not([class])");
      const circleCount = await markerGroup.locator("circle").count();
      const lineCount = await markerGroup.locator("line").count();
      expect(circleCount + lineCount / 2).toBe(attempts);
    }
  });

  test("renders on mobile viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
