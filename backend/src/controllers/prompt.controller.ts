import { NextFunction, Request, Response } from "express";
import { SuggestionsGenerator } from "src/services/SuggestionGenerator";
import { PromptRefiner } from "src/services/PromptRefiner";

export const generateSuggestionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { promptIdea } = req.body;
    const suggestions = await SuggestionsGenerator.generate(promptIdea);
    res.status(200).json(suggestions);
  } catch (error) {
    next(error);
  }
};

export const refinePromptController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { promptToRefine } = req.body;
    if (!promptToRefine || typeof promptToRefine !== "string") {
      return res.status(400).json({
        error: "Campo 'promptToRefine' é obrigatório e deve ser uma string.",
      });
    }
    const refinedPrompt = await PromptRefiner.refine(promptToRefine);
    res.status(200).json({ refinedPrompt });
  } catch (error) {
    next(error);
  }
};
