import express from "express";
import cors from "cors";
import { SuggestionsGenerator } from "./services/SuggestionGenerator";

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

app.post("/api", (req, res) => {
  const { promptIdea } = req.body;
  const suggestions = SuggestionsGenerator.generate(promptIdea);
  res.status(200).json(suggestions);
});

app.listen(port, () => {
  console.log(`[backend]: listening in localhost:${port}`);
});
