import "reflect-metadata";
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";
import { buildContainer } from "../../src/container/inversify.config";

describe("Orders API", () => {
  let app: ReturnType<typeof createApp>;

  // Fresh container (fresh in-memory store) for every test = full isolation.
  beforeEach(() => {
    const container = buildContainer(false);
    app = createApp(container, "http://localhost:5173");
  });

  const validPayload = {
    items: [{ menuItemId: "m1", quantity: 2 }],
    customer: { name: "Alice", address: "42 Wallaby Way", phone: "9876543210" }
  };

  it("creates an order (POST /api/orders)", async () => {
    const res = await request(app).post("/api/orders").send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("RECEIVED");
    expect(res.body.data.totalAmount).toBe(498);
  });

  it("rejects an order with no items", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ items: [], customer: validPayload.customer });
    expect(res.status).toBe(400);
  });

  it("rejects an order with missing customer details", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ items: validPayload.items });
    expect(res.status).toBe(400);
  });

  it("rejects an order for an unknown menu item", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ items: [{ menuItemId: "ghost", quantity: 1 }], customer: validPayload.customer });
    expect(res.status).toBe(400);
  });

  it("fetches an order by id (GET /api/orders/:id)", async () => {
    const created = await request(app).post("/api/orders").send(validPayload);
    const res = await request(app).get(`/api/orders/${created.body.data.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(created.body.data.id);
  });

  it("returns 404 for a non-existent order", async () => {
    const res = await request(app).get("/api/orders/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("lists all orders (GET /api/orders)", async () => {
    await request(app).post("/api/orders").send(validPayload);
    await request(app).post("/api/orders").send(validPayload);
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it("updates order status forward (PATCH /api/orders/:id/status)", async () => {
    const created = await request(app).post("/api/orders").send(validPayload);
    const res = await request(app)
      .patch(`/api/orders/${created.body.data.id}/status`)
      .send({ status: "PREPARING" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("PREPARING");
  });

  it("rejects an invalid status value", async () => {
    const created = await request(app).post("/api/orders").send(validPayload);
    const res = await request(app)
      .patch(`/api/orders/${created.body.data.id}/status`)
      .send({ status: "FLYING" });
    expect(res.status).toBe(400);
  });

  it("rejects a backwards status transition", async () => {
    const created = await request(app).post("/api/orders").send(validPayload);
    await request(app)
      .patch(`/api/orders/${created.body.data.id}/status`)
      .send({ status: "PREPARING" });
    const res = await request(app)
      .patch(`/api/orders/${created.body.data.id}/status`)
      .send({ status: "RECEIVED" });
    expect(res.status).toBe(400);
  });

  it("returns 404 when updating status of a non-existent order", async () => {
    const res = await request(app)
      .patch("/api/orders/does-not-exist/status")
      .send({ status: "PREPARING" });
    expect(res.status).toBe(404);
  });
});
