// Run with `npm run seed` (requires MONGO_URI set in .env).
// Populates the `menuitems` collection so the Mongo-backed API has data.
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { MenuItemModel } from "../models/MenuItemModel";
import { menuData } from "./menuData";

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set in .env - nothing to seed.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  await MenuItemModel.deleteMany({});
  await MenuItemModel.insertMany(menuData);
  console.log(`Seeded ${menuData.length} menu items.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
