import { app } from "./app";
import { config } from "./config";

const port: number = config.PORT;

app.listen(port, () => {
  console.log(`[backend]: listening in localhost:${port}`);
});
