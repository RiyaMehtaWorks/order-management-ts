import { defineConfig } from "vitest/config";

// Vitest config for backend unit + integration (API) tests.
// "reflect-metadata" must load first because InversifyJS decorators need it.
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["reflect-metadata"],
    coverage: {
      reporter: ["text", "html"],
      exclude: ["dist/**", "src/server.ts"]
    }
  }
});
