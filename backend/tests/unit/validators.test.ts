import { describe, it, expect } from "vitest";
import { validateCreateOrderInput, validateStatusInput } from "../../src/utils/validators";
import { ApiError } from "../../src/utils/ApiError";

describe("validateCreateOrderInput", () => {
  const validCustomer = { name: "John Doe", address: "221B Baker Street", phone: "9876543210" };

  it("accepts a valid order payload", () => {
    const result = validateCreateOrderInput({
      items: [{ menuItemId: "m1", quantity: 2 }],
      customer: validCustomer
    });
    expect(result.items).toHaveLength(1);
    expect(result.customer.name).toBe("John Doe");
  });

  it("rejects an empty items array", () => {
    expect(() =>
      validateCreateOrderInput({ items: [], customer: validCustomer })
    ).toThrow(ApiError);
  });

  it("rejects a missing body", () => {
    expect(() => validateCreateOrderInput(null)).toThrow(ApiError);
  });

  it("rejects a non-integer quantity", () => {
    expect(() =>
      validateCreateOrderInput({
        items: [{ menuItemId: "m1", quantity: 1.5 }],
        customer: validCustomer
      })
    ).toThrow(/quantity/);
  });

  it("rejects a quantity of 0", () => {
    expect(() =>
      validateCreateOrderInput({
        items: [{ menuItemId: "m1", quantity: 0 }],
        customer: validCustomer
      })
    ).toThrow(ApiError);
  });

  it("rejects a quantity above 50", () => {
    expect(() =>
      validateCreateOrderInput({
        items: [{ menuItemId: "m1", quantity: 51 }],
        customer: validCustomer
      })
    ).toThrow(ApiError);
  });

  it("rejects a short customer name", () => {
    expect(() =>
      validateCreateOrderInput({
        items: [{ menuItemId: "m1", quantity: 1 }],
        customer: { ...validCustomer, name: "J" }
      })
    ).toThrow(/name/);
  });

  it("rejects an invalid phone number", () => {
    expect(() =>
      validateCreateOrderInput({
        items: [{ menuItemId: "m1", quantity: 1 }],
        customer: { ...validCustomer, phone: "abc" }
      })
    ).toThrow(/phone/);
  });

  it("rejects a short address", () => {
    expect(() =>
      validateCreateOrderInput({
        items: [{ menuItemId: "m1", quantity: 1 }],
        customer: { ...validCustomer, address: "NY" }
      })
    ).toThrow(/address/);
  });
});

describe("validateStatusInput", () => {
  it("accepts a valid status", () => {
    expect(validateStatusInput({ status: "PREPARING" })).toBe("PREPARING");
  });

  it("rejects an unknown status", () => {
    expect(() => validateStatusInput({ status: "FLYING" })).toThrow(ApiError);
  });

  it("rejects a missing status", () => {
    expect(() => validateStatusInput({})).toThrow(ApiError);
  });
});
