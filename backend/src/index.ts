import express, { Application } from "express";
import cors from "cors";

import { config } from "./config";
import { promptRoutes } from "./routes/prompt.routes";

const app: Application = express();
const port: number = config.PORT;

app.use(cors());
app.use(express.json());

app.use("/api", promptRoutes);

app.listen(port, () => {
  console.log(`[backend]: listening in localhost:${port}`);
});
