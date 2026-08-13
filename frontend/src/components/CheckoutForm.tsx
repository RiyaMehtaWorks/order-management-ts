import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useCart } from "../hooks/useCart";
import { createOrder } from "../api/orders";

interface Props {
  onSuccess: (orderId: string) => void;
}

interface FormErrors {
  name?: string;
  address?: string;
  phone?: string;
}

// Delivery-details form + submit. Validates client-side first (fast
// feedback), then relies on the backend's authoritative validation too
// (never trust the client alone).
export default function CheckoutForm({ onSuccess }: Props) {
  const { lines, totalPrice } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      toast.success("Order placed! Tracking it now...");
      onSuccess(order.id);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    }
  });

  function validate(): boolean {
    const next: FormErrors = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (address.trim().length < 5) next.address = "Enter a complete delivery address.";
    if (!/^[0-9+\-\s()]{7,15}$/.test(phone.trim())) next.phone = "Enter a valid phone number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({
      items: lines.map((l) => ({ menuItemId: l.menuItem.id, quantity: l.quantity })),
      customer: { name: name.trim(), address: address.trim(), phone: phone.trim() }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="John Doe"
            data-testid="input-name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="House no, street, city, pincode"
            rows={3}
            data-testid="input-address"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="98765 43210"
            data-testid="input-phone"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>
      </div>

      <div className="border-t p-4">
        <div className="mb-3 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="clickable w-full rounded-lg bg-brand py-3 font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="place-order-btn"
        >
          {mutation.isPending ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </form>
  );
}
