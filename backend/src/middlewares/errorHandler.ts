import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

// Central error handler - MUST be registered last in app.ts (4-arg
// signature is what tells Express this is an error middleware).
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: { message: err.message, details: err.details }
    });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({
    error: { message: "Internal server error." }
  });
}

// 404 handler for unknown routes.
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: { message: `Route ${req.method} ${req.path} not found.` } });
}
