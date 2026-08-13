import MenuList from "../components/MenuList";
import CartDrawer from "../components/CartDrawer";

interface Props {
  onOrderPlaced: (orderId: string) => void;
}

// Landing page: hero banner + the full menu + the floating cart.
export default function HomePage({ onOrderPlaced }: Props) {
  return (
    <div>
      <div className="bg-gradient-to-r from-brand to-brand-dark px-4 py-10 text-center text-white">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Order food you love</h1>
        <p className="mt-2 text-white/90">Fresh, fast, and delivered right to your door.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 pb-28">
        <MenuList />
      </div>

      <CartDrawer onOrderPlaced={onOrderPlaced} />
    </div>
  );
}
