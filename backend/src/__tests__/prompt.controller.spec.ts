import { expect, test, vitest, vi, describe, afterEach } from "vitest";
import request from "supertest";
import { app } from "../app";

vi.mock("../services/PromptRefiner");
vi.mock("../services/SuggestionGenerator");
interface MinuteLimiter {
  (req: Request, res: Response, next: NextFunction): void;
}

interface DayLimiter {
  (req: Request, res: Response, next: NextFunction): void;
}

vi.mock("../middlewares/rateLimit", () => ({
  minuteLimiter: ((req, res, next) => next()) as MinuteLimiter,
  dayLimiter: ((req, res, next) => next()) as DayLimiter,
}));

import { SuggestionsGenerator } from "../services/SuggestionGenerator";
import { PromptRefiner } from "../services/PromptRefiner";
import { Request, Response, NextFunction } from "express";

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/prompts/suggestions", () => {
  test("must return http code 200 and a object of suggestions when the payload is valid", async () => {
    const mockValidSuggestions = {
      role: ["role", "role"],
      objective: ["objective", "objective"],
      audience: ["audience", "audience"],
      style: ["style", "style"],
      outputFormat: ["outputFormat", "outputFormat"],
    };

    vi.mocked(SuggestionsGenerator.generate).mockResolvedValue(
      mockValidSuggestions
    );

    const validPayload = {
      promptIdea: "validated prompt with 10 chars",
    };

    const response = await request(app)
      .post("/api/prompts/suggestions")
      .send(validPayload);
    expect(response.status).toBe(200);

    expect(response.body).toEqual(mockValidSuggestions);

    expect(SuggestionsGenerator.generate).toHaveBeenCalledOnce();

    expect(SuggestionsGenerator.generate).toHaveBeenCalledWith(
      validPayload.promptIdea
    );
  });

  test("must return http code 400 and a error message when the payload is too short", async () => {
    const invalidPayload = {
      promptIdea: "x",
    };

    const response = await request(app)
      .post("/api/prompts/suggestions")
      .send(invalidPayload);
    expect(response.status).toBe(400);

    expect(response.body.error).toEqual("Invalid input data");

    expect(SuggestionsGenerator.generate).not.toHaveBeenCalled();
  });
});

describe("POST /api/prompts/refine", () => {
  test("must return http code 200 and a refined prompt when the payload is valid", async () => {
    const mockRefinedPrompt = "refined prompt by the mock";

    vi.mocked(PromptRefiner.refine).mockResolvedValue(mockRefinedPrompt);

    const validPayload = {
      promptToRefine: "validated prompt with 10 chars",
    };

    const response = await request(app)
      .post("/api/prompts/refine")
      .send(validPayload);
    expect(response.status).toBe(200);

    expect(response.body).toEqual({ refinedPrompt: mockRefinedPrompt });

    expect(PromptRefiner.refine).toHaveBeenCalledOnce();

    expect(PromptRefiner.refine).toHaveBeenCalledWith(
      validPayload.promptToRefine
    );
  });

  test("must return http code 400 and a error message when the payload is too short", async () => {
    const invalidPayload = {
      promptToRefine: "x",
    };

    const response = await request(app)
      .post("/api/prompts/refine")
      .send(invalidPayload);
    expect(response.status).toBe(400);

    expect(response.body.error).toEqual("Invalid input data");

    expect(PromptRefiner.refine).not.toHaveBeenCalled();
  });
});
