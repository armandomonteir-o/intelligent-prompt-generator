import express, { Application } from "express";
import cors from "cors";
import { generateSuggestionsController } from "./controllers/prompt.controller";
import { dayLimiter, minuteLimiter } from "./middlewares/rateLimit";
import { config } from "./config";
import { Request, Response } from "express";

const app: Application = express();
const port: number = config.PORT;

app.use(cors());
app.use("/api", minuteLimiter, dayLimiter);
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api", generateSuggestionsController);

app.listen(port, () => {
  console.log(`[backend]: listening in localhost:${port}`);
});
