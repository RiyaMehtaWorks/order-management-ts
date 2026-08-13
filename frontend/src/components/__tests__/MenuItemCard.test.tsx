import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MenuItemCard from "../MenuItemCard";
import { CartProvider } from "../../hooks/useCart";
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

function renderWithCart(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe("MenuItemCard", () => {
  it("renders item details", () => {
    renderWithCart(<MenuItemCard item={item} />);
    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(screen.getByText("₹249")).toBeInTheDocument();
  });

  it("shows an ADD button initially, then a quantity stepper after clicking", () => {
    renderWithCart(<MenuItemCard item={item} />);
    const addBtn = screen.getByTestId("add-btn-m1");
    fireEvent.click(addBtn);
    expect(screen.getByTestId("qty-m1")).toHaveTextContent("1");
  });

  it("increments quantity on + click", () => {
    renderWithCart(<MenuItemCard item={item} />);
    fireEvent.click(screen.getByTestId("add-btn-m1"));
    fireEvent.click(screen.getByLabelText("Increase Margherita Pizza quantity"));
    expect(screen.getByTestId("qty-m1")).toHaveTextContent("2");
  });

  it("renders a disabled Unavailable button for sold-out items", () => {
    renderWithCart(<MenuItemCard item={{ ...item, available: false }} />);
    const btn = screen.getByText("Unavailable");
    expect(btn).toBeDisabled();
  });
});
