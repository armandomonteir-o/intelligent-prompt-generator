import express from "express";
import cors from "cors";
import { mockSuggestions } from "./mocks/suggestionsMock";
import { mockMarketing } from "./mocks/marketingMock";

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

app.post("/api", (req, res) => {
  const { promptIdea } = req.body;
  const textoPrincipal: string = promptIdea;
  const palavraChave = "marketing";

  if (textoPrincipal.toLowerCase().includes(palavraChave)) {
    console.log("servindo o mock de marketing");
    res.status(200).json(mockMarketing);
  } else {
    console.log("servindo o mock padrão.");
    res.status(200).json(mockSuggestions);
  }
});

app.listen(port, () => {
  console.log(`[backend]: listening in localhost:${port}`);
});
