import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { createApp } from "./app";
import { buildContainer } from "./container/inversify.config";
import { connectMongo } from "./config/db";
import { socketEmitter } from "./sockets";

const PORT = Number(process.env.PORT) || 5001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const MONGO_URI = process.env.MONGO_URI?.trim();

async function main() {
  let useMongo = false;

  if (MONGO_URI) {
    try {
      await connectMongo(MONGO_URI);
      useMongo = true;
    } catch (err) {
      console.error(
        "Failed to connect to MongoDB, falling back to in-memory store:",
        err,
      );
    }
  } else {
    console.log("MONGO_URI not set - using in-memory store.");
  }

  const container = buildContainer(useMongo);
  const app = createApp(container, CLIENT_ORIGIN);

  const httpServer = http.createServer(app);
  socketEmitter.init(httpServer, CLIENT_ORIGIN);

  httpServer.listen(PORT, () => {
    console.log(
      `API running on http://localhost:${PORT} (store: ${useMongo ? "MongoDB" : "in-memory"})`,
    );
  });
}

main();
