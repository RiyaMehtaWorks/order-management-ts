import { useState } from "react";
import HomePage from "./pages/HomePage";
import OrderStatusPage from "./pages/OrderStatusPage";
import Navbar from "./components/Navbar";

// Minimal hand-rolled router (no react-router dependency needed for two
// screens): tracks which order id, if any, is being tracked.
export default function App() {
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onLogoClick={() => setTrackingOrderId(null)}
        isTracking={!!trackingOrderId}
      />
      <main className="flex-1">
        {trackingOrderId ? (
          <OrderStatusPage
            orderId={trackingOrderId}
            onBackToMenu={() => setTrackingOrderId(null)}
          />
        ) : (
          <HomePage onOrderPlaced={(orderId) => setTrackingOrderId(orderId)} />
        )}
      </main>
    </div>
  );
}
