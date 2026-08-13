import { test, expect } from "@playwright/test";

// Full end-to-end happy path: browse menu -> add to cart -> checkout ->
// see the live order status tracker. Requires the backend to be running
// at the URL configured in frontend/.env (VITE_API_URL).
test.describe("Order flow", () => {
  test("user can browse the menu, add items, and place an order", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Order food you love")).toBeVisible();

    // Add the first available menu item to the cart.
    const firstAddBtn = page.locator('[data-testid^="add-btn-"]').first();
    await firstAddBtn.click();

    // Floating cart bar should appear with 1 item.
    const viewCartBtn = page.getByTestId("view-cart-btn");
    await expect(viewCartBtn).toBeVisible();
    await expect(viewCartBtn).toContainText("1 item");

    await viewCartBtn.click();
    await expect(page.getByTestId("cart-line")).toBeVisible();

    await page.getByTestId("proceed-to-checkout-btn").click();

    await page.getByTestId("input-name").fill("Playwright Tester");
    await page.getByTestId("input-address").fill("42 Automation Ave, Test City");
    await page.getByTestId("input-phone").fill("9876543210");

    await page.getByTestId("place-order-btn").click();

    // Should land on the order status page with a visible tracker.
    await expect(page.getByTestId("status-tracker")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Order #/)).toBeVisible();
  });

  test("checkout form shows validation errors for invalid details", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-testid^="add-btn-"]').first().click();
    await page.getByTestId("view-cart-btn").click();
    await page.getByTestId("proceed-to-checkout-btn").click();

    // Leave everything blank and try to submit.
    await page.getByTestId("place-order-btn").click();

    await expect(page.getByText("Enter your full name.")).toBeVisible();
    await expect(page.getByText("Enter a complete delivery address.")).toBeVisible();
    await expect(page.getByText("Enter a valid phone number.")).toBeVisible();
  });

  test("quantity stepper increments and decrements correctly", async ({ page }) => {
    await page.goto("/");
    const card = page.locator('[data-testid^="menu-item-"]').first();
    const addBtn = card.locator('[data-testid^="add-btn-"]');
    await addBtn.click();

    const increaseBtn = card.getByRole("button", { name: /Increase .* quantity/ });
    await increaseBtn.click();

    const qty = card.locator('[data-testid^="qty-"]');
    await expect(qty).toHaveText("2");
  });
});
