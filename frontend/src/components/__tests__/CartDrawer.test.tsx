import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CartDrawer from "../CartDrawer";
import { CartProvider, useCart } from "../../hooks/useCart";
import { MenuItem } from "../../types";

const item: MenuItem = {
  id: "m1",
  name: "Margherita Pizza",
  description: "Classic cheese pizza",
  price: 249,
  image: "https://example.com/pizza.jpg",
  category: "Pizza",
  available: true
};

// Small helper component to seed the cart before rendering CartDrawer.
function Seed() {
  const { addItem } = useCart();
  return <button onClick={() => addItem(item)} data-testid="seed">seed</button>;
}

function renderCart() {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <CartProvider>
        <Seed />
        <CartDrawer onOrderPlaced={() => {}} />
      </CartProvider>
    </QueryClientProvider>
  );
}

describe("CartDrawer", () => {
  it("stays hidden when the cart is empty", () => {
    renderCart();
    expect(screen.queryByTestId("view-cart-btn")).not.toBeInTheDocument();
  });

  it("shows the floating bar once an item is added, and opens the drawer", () => {
    renderCart();
    fireEvent.click(screen.getByTestId("seed"));
    const viewCartBtn = screen.getByTestId("view-cart-btn");
    expect(viewCartBtn).toBeInTheDocument();
    fireEvent.click(viewCartBtn);
    expect(screen.getByTestId("cart-line")).toBeInTheDocument();
    expect(screen.getByTestId("proceed-to-checkout-btn")).toBeInTheDocument();
  });

  it("moves to the checkout form when 'Proceed to Checkout' is clicked", () => {
    renderCart();
    fireEvent.click(screen.getByTestId("seed"));
    fireEvent.click(screen.getByTestId("view-cart-btn"));
    fireEvent.click(screen.getByTestId("proceed-to-checkout-btn"));
    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("place-order-btn")).toBeInTheDocument();
  });
});
