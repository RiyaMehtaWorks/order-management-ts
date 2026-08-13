import { useCart } from "../hooks/useCart";

interface Props {
  onLogoClick: () => void;
  isTracking: boolean;
}

// Sticky top bar - brand logo (click to go back to menu) + a live cart
// item-count badge, Zomato-style.
export default function Navbar({ onLogoClick, isTracking }: Props) {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <button
          onClick={onLogoClick}
          className="clickable flex items-center gap-2 text-2xl font-extrabold text-brand"
        >
          <span aria-hidden>🍔</span> FoodHub
        </button>

        {!isTracking && totalItems > 0 && (
          <div className="clickable flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-dark">
            🛒 {totalItems} item{totalItems > 1 ? "s" : ""} in cart
          </div>
        )}
      </div>
    </header>
  );
}
