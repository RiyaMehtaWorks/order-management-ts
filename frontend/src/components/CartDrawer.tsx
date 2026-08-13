import { useState } from "react";
import { useCart } from "../hooks/useCart";
import CheckoutForm from "./CheckoutForm";

interface Props {
  onOrderPlaced: (orderId: string) => void;
}

// Slide-over cart, fixed to the bottom-right (mirrors Zomato/Swiggy's
// floating cart bar). Two internal views: line-item review, then checkout.
export default function CartDrawer({ onOrderPlaced }: Props) {
  const { lines, removeItem, setQuantity, totalItems, totalPrice, clearCart } =
    useCart();
  const [open, setOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  if (totalItems === 0) return null;

  return (
    <>
      {/* Floating summary bar */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="clickable fixed bottom-4 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-xl transition hover:bg-brand-dark sm:px-6"
          data-testid="view-cart-btn"
        >
          <span className="whitespace-nowrap">
            {totalItems} item{totalItems > 1 ? "s" : ""} · ₹{totalPrice}
          </span>

          <span className="whitespace-nowrap">View Cart →</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl sm:rounded-l-2xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-bold">
                {checkingOut ? "Delivery Details" : "Your Cart"}
              </h2>
              <button
                onClick={() =>
                  checkingOut ? setCheckingOut(false) : setOpen(false)
                }
                className="clickable rounded-full p-2 text-xl hover:bg-neutral-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {!checkingOut ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {lines.map((line) => (
                    <div
                      key={line.menuItem.id}
                      className="flex items-center gap-3"
                      data-testid="cart-line"
                    >
                      <img
                        src={line.menuItem.image}
                        alt=""
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{line.menuItem.name}</p>
                        <p className="text-sm text-neutral-500">
                          ₹{line.menuItem.price} x {line.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setQuantity(line.menuItem.id, line.quantity - 1)
                          }
                          className="clickable rounded border px-2 py-1 hover:bg-neutral-100"
                        >
                          -
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          onClick={() =>
                            setQuantity(line.menuItem.id, line.quantity + 1)
                          }
                          className="clickable rounded border px-2 py-1 hover:bg-neutral-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(line.menuItem.id)}
                        className="clickable text-red-500 hover:text-red-700"
                        aria-label={`Remove ${line.menuItem.name}`}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t p-4">
                  <div className="mb-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <button
                    onClick={() => setCheckingOut(true)}
                    className="clickable w-full rounded-lg bg-brand py-3 font-bold text-white hover:bg-brand-dark"
                    data-testid="proceed-to-checkout-btn"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            ) : (
              <CheckoutForm
                onSuccess={(orderId) => {
                  clearCart();
                  setOpen(false);
                  setCheckingOut(false);
                  onOrderPlaced(orderId);
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
