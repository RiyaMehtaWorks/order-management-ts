import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { CartProvider } from "./hooks/useCart";
import "./index.css";

// One shared TanStack Query client for the whole app - caches menu/order
// fetches, handles retries/loading/error state so components don't have to.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <App />
        <Toaster position="top-center" />
      </CartProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
