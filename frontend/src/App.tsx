import { useState } from "react";
import HomePage from "./pages/HomePage";
import OrderStatusPage from "./pages/OrderStatusPage";
import Navbar from "./components/Navbar";
import OrderHistoryPage from "./pages/OrderHistoryPage";

// Minimal hand-rolled router (no react-router dependency needed for two
// screens): tracks which order id, if any, is being tracked.
export default function App() {
  const [screen, setScreen] = useState<"home" | "history" | "tracking">("home");
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const showHome = () => {
    setTrackingOrderId(null);
    setScreen("home");
  };

  const showHistory = () => {
    setTrackingOrderId(null);
    setScreen("history");
  };

  const trackOrder = (orderId: string) => {
    setTrackingOrderId(orderId);
    setScreen("tracking");
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onLogoClick={() => setTrackingOrderId(null)}
        onOrderHistoryClick={showHistory}
        isTracking={!!trackingOrderId}
      />
      <main className="flex-1">
        {screen === "history" ? (
          <OrderHistoryPage
            onSelectOrder={trackOrder}
            onBackToMenu={showHome}
          />
        ) : screen === "tracking" && trackingOrderId ? (
          <OrderStatusPage orderId={trackingOrderId} onBackToMenu={showHome} />
        ) : (
          <HomePage onOrderPlaced={trackOrder} />
        )}
      </main>
    </div>
  );
}
