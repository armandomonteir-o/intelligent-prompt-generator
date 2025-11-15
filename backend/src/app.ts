import express, { Application } from "express";
import cors from "cors";

import { promptRoutes } from "./routes/prompt.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/prompts", promptRoutes);

app.use(errorHandler);

export { app };
