import { MenuItem } from "../types";

// Seed menu data. Used by the in-memory repository directly, and by
// `data/seed.ts` to populate MongoDB when MONGO_URI is configured.
export const menuData: MenuItem[] = [
  {
    id: "m1",
    name: "Margherita Pizza",
    description: "Classic delight with 100% real mozzarella cheese.",
    price: 249,
    image: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=500",
    category: "Pizza",
    available: true
  },
  {
    id: "m2",
    name: "Farmhouse Pizza",
    description: "Delightful combination of onion, capsicum, tomato & mushroom.",
    price: 329,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    category: "Pizza",
    available: true
  },
  {
    id: "m3",
    name: "Classic Cheese Burger",
    description: "Juicy grilled patty with cheddar cheese and fresh veggies.",
    price: 149,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
    category: "Burgers",
    available: true
  },
  {
    id: "m4",
    name: "Spicy Chicken Burger",
    description: "Crispy chicken patty tossed in a fiery peri-peri sauce.",
    price: 189,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500",
    category: "Burgers",
    available: true
  },
  {
    id: "m5",
    name: "Butter Chicken",
    description: "Tender chicken in a rich, creamy tomato gravy.",
    price: 299,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500",
    category: "Main Course",
    available: true
  },
  {
    id: "m6",
    name: "Paneer Tikka",
    description: "Chargrilled cottage cheese marinated in spiced yogurt.",
    price: 259,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
    category: "Starters",
    available: true
  },
  {
    id: "m7",
    name: "Veg Hakka Noodles",
    description: "Wok-tossed noodles with crunchy vegetables & soy sauce.",
    price: 179,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500",
    category: "Chinese",
    available: true
  },
  {
    id: "m8",
    name: "Chocolate Brownie",
    description: "Warm fudgy brownie served with a scoop of vanilla ice cream.",
    price: 129,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500",
    category: "Desserts",
    available: true
  },
  {
    id: "m9",
    name: "Cold Coffee",
    description: "Chilled, frothy coffee blended with fresh milk & ice cream.",
    price: 99,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500",
    category: "Beverages",
    available: true
  },
  {
    id: "m10",
    name: "Sushi Platter",
    description: "Assorted fresh sushi rolls, currently out of stock.",
    price: 399,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500",
    category: "Starters",
    available: false
  }
];
