import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    // Playwright e2e specs live in /e2e and run via `npm run e2e` - keep
    // them out of the Vitest (component/unit) run.
    exclude: ["**/node_modules/**", "**/e2e/**"]
  }
});
