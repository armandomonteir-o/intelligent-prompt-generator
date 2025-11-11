import { NextFunction, Request, Response } from "express";
import { SuggestionsGenerator } from "../services/SuggestionGenerator";
import { PromptRefiner } from "../services/PromptRefiner";
import { z } from "zod";
import {
  refineBodySchema,
  suggestionsBodySchema,
} from "../types/prompt.schema";

export const generateSuggestionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationResult = suggestionsBodySchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid input data",
        details: z.treeifyError(validationResult.error),
      });
    }

    const { promptIdea } = validationResult.data;
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
    const validationResult = refineBodySchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid input data",
        details: z.treeifyError(validationResult.error),
      });
    }
    const { promptToRefine } = validationResult.data;

    const refinedPrompt = await PromptRefiner.refine(promptToRefine);
    res.status(200).json({ refinedPrompt });
  } catch (error) {
    next(error);
  }
};
