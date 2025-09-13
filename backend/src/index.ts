import express from "express";

const app = express();
const port = 3005;

app.get("/api", (req, res) => {
  res.status(200).send("hello world");
});

app.listen(port, () => {
  console.log(`[backend]: listening in localhost:${port}`);
});
