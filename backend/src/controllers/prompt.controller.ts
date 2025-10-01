import { NextFunction, Request, Response } from "express";
import { SuggestionsGenerator } from "src/services/SuggestionGenerator";

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
