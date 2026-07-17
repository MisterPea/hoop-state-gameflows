import { defineConfig, devices } from "@playwright/test";

// This app builds via `output: "export"` (see next.config.ts) — there is no
// Next server to boot. `webServer` below serves the static `out/` dir
// directly. Run `npm run build` before `npm run test:e2e` (or use the
// combined `npm run e2e` script) so `out/` reflects the code under test.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Add once the chromium suite is stable:
    // { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    // { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npx serve out -l 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
});
