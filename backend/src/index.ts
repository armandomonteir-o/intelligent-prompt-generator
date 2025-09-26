import express from "express";
import cors from "cors";
import { SuggestionsGenerator } from "./services/SuggestionGenerator";

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

app.post("/api", async (req, res) => {
  try {
    const { promptIdea } = req.body;

    const suggestions = await SuggestionsGenerator.generate(promptIdea);
    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Erro no endpoint /api", error);
    res.status(500).json({
      error: "Houve um problema ao gerar as sugestões. Tente novamente.",
    });
  }
});

app.listen(port, () => {
  console.log(`[backend]: listening in localhost:${port}`);
});
