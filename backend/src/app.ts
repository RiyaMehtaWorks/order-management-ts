import express, { Express } from "express";
import cors from "cors";
import { Container } from "inversify";
import { apiRoutes } from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

// Builds the Express app. Separated from server.ts so tests can import
// `createApp()` and hit it with supertest without actually binding a port
// or a real socket server.
export function createApp(container: Container, clientOrigin: string): Express {
  const app = express();

  app.use(cors({ origin: clientOrigin.split(",") }));
  app.use(express.json());

  app.use("/api", apiRoutes(container));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
