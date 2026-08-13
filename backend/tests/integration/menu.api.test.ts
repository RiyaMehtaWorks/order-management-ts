import "reflect-metadata";
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";
import { buildContainer } from "../../src/container/inversify.config";

// Integration tests hit real HTTP routes (via supertest) against the
// in-memory store - no real DB/network needed, fast and deterministic.
describe("GET /api/menu", () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    const container = buildContainer(false);
    app = createApp(container, "http://localhost:5173");
  });

  it("returns the seeded menu list", async () => {
    const res = await request(app).get("/api/menu");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty("price");
  });

  it("returns a single menu item by id", async () => {
    const res = await request(app).get("/api/menu/m1");
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Margherita Pizza");
  });

  it("returns 404 for an unknown menu item", async () => {
    const res = await request(app).get("/api/menu/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.error.message).toMatch(/not found/i);
  });

  it("returns 404 for an unknown route", async () => {
    const res = await request(app).get("/api/nonsense");
    expect(res.status).toBe(404);
  });
});
