import express from "express";
import cors from "cors";

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

app.post("/api", (req, res) => {
  const { promptIdea } = req.body;

  console.log("recebido do front:", promptIdea);
  res.status(200).json({
    message: "Ideia recebida com sucesso",
    idea: promptIdea,
  });
});

app.listen(port, () => {
  console.log(`[backend]: listening in localhost:${port}`);
});
