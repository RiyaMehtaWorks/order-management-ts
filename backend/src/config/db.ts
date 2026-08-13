import mongoose from "mongoose";

// Connects to MongoDB only if a URI is provided. Called from server.ts
// before the DI container is built, so repositories can be selected based
// on whether this succeeds.
export async function connectMongo(uri: string) {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");
}
