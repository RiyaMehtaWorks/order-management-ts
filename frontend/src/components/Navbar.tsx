import { useCart } from "../hooks/useCart";

interface Props {
  onLogoClick: () => void;
  isTracking: boolean;
}

// Sticky top bar - brand logo + live cart item-count indicator.
export default function Navbar({ onLogoClick, isTracking }: Props) {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          onClick={onLogoClick}
          className="clickable flex items-center gap-2 text-xl font-extrabold text-brand sm:text-2xl"
        >
          <span aria-hidden>🍔</span>
          <span>FoodHub</span>
        </button>

        {!isTracking && totalItems > 0 && (
          <div
            className="flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-2 text-sm font-semibold text-brand sm:px-4"
            aria-label={`${totalItems} item${totalItems > 1 ? "s" : ""} in cart`}
          >
            <span className="text-base" aria-hidden>
              🛒
            </span>

            <span>
              {totalItems} item{totalItems > 1 ? "s" : ""}
              <span className="hidden sm:inline"> in cart</span>
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
