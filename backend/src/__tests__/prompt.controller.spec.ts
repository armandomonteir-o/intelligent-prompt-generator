import { expect, test, vitest, vi, describe, afterEach } from "vitest";
import request from "supertest";
import { app } from "../app";

vi.mock("../services/PromptRefiner");

import { PromptRefiner } from "../services/PromptRefiner";

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/prompts/refine", () => {
  test("must return http code 200 and a refined prompt when the data is valid", async () => {
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

  test("must return http code 400 and a error message when the data is too short", async () => {
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
