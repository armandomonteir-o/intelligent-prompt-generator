import { Router, Request, Response } from "express";
import {
  generateSuggestionsController,
  refinePromptController,
} from "src/controllers/prompt.controller";
import { dayLimiter, minuteLimiter } from "src/middlewares/rateLimit";

export const promptRoutes: Router = Router();

promptRoutes.post(
  "/suggestions",
  minuteLimiter,
  dayLimiter,
  generateSuggestionsController
);

promptRoutes.post("/refine", minuteLimiter, dayLimiter, refinePromptController);

promptRoutes.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
