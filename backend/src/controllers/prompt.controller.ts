import { Request, Response } from "express";
import { SuggestionsGenerator } from "src/services/SuggestionGenerator";

export const generateSuggestionsController = async (
  req: Request,
  res: Response
) => {
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
};
