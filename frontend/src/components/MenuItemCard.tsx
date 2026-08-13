import { MenuItem } from "../types";
import { useCart } from "../hooks/useCart";

interface Props {
  item: MenuItem;
}

// A single menu item card - image, name, description, price, and an
// Add/quantity-stepper control. Disabled + greyed out when unavailable.
export default function MenuItemCard({ item }: Props) {
  const { lines, addItem, setQuantity } = useCart();
  const line = lines.find((l) => l.menuItem.id === item.id);

  return (
    <div
      className={`group overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl ${
        !item.available ? "opacity-60" : ""
      }`}
      data-testid={`menu-item-${item.id}`}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {!item.available && (
          <span className="absolute top-2 left-2 rounded-full bg-neutral-900/80 px-3 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-neutral-900">{item.name}</h3>
          <span className="whitespace-nowrap font-bold text-neutral-800">₹{item.price}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{item.description}</p>

        <div className="mt-3">
          {!item.available ? (
            <button disabled className="w-full cursor-not-allowed rounded-lg bg-neutral-200 py-2 text-sm font-semibold text-neutral-400">
              Unavailable
            </button>
          ) : !line ? (
            <button
              onClick={() => addItem(item)}
              className="clickable w-full rounded-lg border-2 border-brand py-2 text-sm font-bold text-brand hover:bg-brand hover:text-white"
              data-testid={`add-btn-${item.id}`}
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-lg border-2 border-brand text-brand">
              <button
                onClick={() => setQuantity(item.id, line.quantity - 1)}
                className="clickable px-3 py-2 font-bold hover:bg-brand/10"
                aria-label={`Decrease ${item.name} quantity`}
              >
                -
              </button>
              <span className="font-bold" data-testid={`qty-${item.id}`}>
                {line.quantity}
              </span>
              <button
                onClick={() => setQuantity(item.id, line.quantity + 1)}
                className="clickable px-3 py-2 font-bold hover:bg-brand/10"
                aria-label={`Increase ${item.name} quantity`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
