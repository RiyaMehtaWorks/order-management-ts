import { ApiError } from "./ApiError";
import { CreateOrderInput } from "../types";

// Basic, dependency-free validators. Kept pure (no I/O) so they are easy to
// unit test in isolation.

const PHONE_REGEX = /^[0-9+\-\s()]{7,15}$/;

export function validateCreateOrderInput(body: unknown): CreateOrderInput {
  if (!body || typeof body !== "object") {
    throw ApiError.badRequest("Request body must be a JSON object.");
  }
  const { items, customer } = body as Record<string, unknown>;

  if (!Array.isArray(items) || items.length === 0) {
    throw ApiError.badRequest("Order must contain at least one item.");
  }

  for (const [idx, raw] of items.entries()) {
    const item = raw as Record<string, unknown>;
    if (!item || typeof item.menuItemId !== "string" || !item.menuItemId.trim()) {
      throw ApiError.badRequest(`items[${idx}].menuItemId is required.`);
    }
    if (
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0 ||
      item.quantity > 50
    ) {
      throw ApiError.badRequest(
        `items[${idx}].quantity must be an integer between 1 and 50.`
      );
    }
  }

  if (!customer || typeof customer !== "object") {
    throw ApiError.badRequest("customer details are required.");
  }
  const c = customer as Record<string, unknown>;

  if (typeof c.name !== "string" || c.name.trim().length < 2) {
    throw ApiError.badRequest("customer.name must be at least 2 characters.");
  }
  if (typeof c.address !== "string" || c.address.trim().length < 5) {
    throw ApiError.badRequest("customer.address must be at least 5 characters.");
  }
  if (typeof c.phone !== "string" || !PHONE_REGEX.test(c.phone.trim())) {
    throw ApiError.badRequest("customer.phone must be a valid phone number.");
  }

  return {
    items: (items as { menuItemId: string; quantity: number }[]).map((i) => ({
      menuItemId: i.menuItemId,
      quantity: i.quantity
    })),
    customer: {
      name: c.name.trim(),
      address: c.address.trim(),
      phone: c.phone.trim()
    }
  };
}

const VALID_STATUSES = [
  "RECEIVED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED"
];

export function validateStatusInput(body: unknown): string {
  if (!body || typeof body !== "object") {
    throw ApiError.badRequest("Request body must be a JSON object.");
  }
  const { status } = body as Record<string, unknown>;
  if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
    throw ApiError.badRequest(
      `status must be one of: ${VALID_STATUSES.join(", ")}`
    );
  }
  return status;
}
