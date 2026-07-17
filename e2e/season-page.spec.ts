import { expect, test } from "@playwright/test";
import { FIXTURE_SEGMENT } from "./fixtures";

test.describe("season segment page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/seasons/${FIXTURE_SEGMENT}`);
  });

  test("header game count matches rendered game cards", async ({ page }) => {
    const headerText = await page.locator("header p").first().textContent();
    const expectedCount = Number(headerText?.match(/(\d+) games/)?.[1]);
    expect(expectedCount).toBeGreaterThan(0);

    const cardCount = await page.locator('a[href^="/games/"]').count();
    expect(cardCount).toBe(expectedCount);
  });

  test("game card opens the game page in a new tab", async ({ page, context }) => {
    const card = page.locator('a[href^="/games/"]').first();
    const href = await card.getAttribute("href");
    await expect(card).toHaveAttribute("target", "_blank");

    const [newPage] = await Promise.all([context.waitForEvent("page"), card.click()]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain(href);
    // Scoped past the site header's own <h1> ("Hoop State").
    await expect(newPage.locator('[class$="gameTitle"] h1')).toBeVisible();
  });

  test("renders on mobile viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
