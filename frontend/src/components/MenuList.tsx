import { useQuery } from "@tanstack/react-query";
import { fetchMenu } from "../api/menu";
import MenuItemCard from "./MenuItemCard";

// Fetches + groups the menu by category (Zomato-style sectioned menu).
// TanStack Query handles loading/error/caching so this component only
// worries about rendering.
export default function MenuList() {
  const { data: menu, isLoading, isError, error } = useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenu
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
        Couldn't load the menu: {(error as Error).message}
      </div>
    );
  }

  if (!menu || menu.length === 0) {
    return <p className="text-center text-neutral-500">No menu items available right now.</p>;
  }

  const categories = Array.from(new Set(menu.map((m) => m.category)));

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <section key={category}>
          <h2 className="mb-3 text-xl font-bold text-neutral-800">{category}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {menu
              .filter((m) => m.category === category)
              .map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
