import { defineConfig, devices } from "@playwright/test";

// End-to-end tests drive the REAL app in a browser. They expect both the
// backend (http://localhost:5001) and this frontend (http://localhost:5173)
// to be running - `webServer` below auto-starts the frontend for you.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 30000,
  },
});
