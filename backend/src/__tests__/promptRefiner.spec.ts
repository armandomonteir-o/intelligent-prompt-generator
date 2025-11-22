import { expect, test, vi, describe, afterEach, beforeEach } from "vitest";

import { PromptRefiner } from "../services/PromptRefiner";

vi.mock("../utils/loadTemplate");
vi.mock("@google/genai");

import { loadTemplate } from "../utils/loadTemplate";
import { GoogleGenAI } from "@google/genai";

describe("PromptRefiner Service", () => {
  let generateContentMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    generateContentMock = vi.fn();

    vi.mocked(GoogleGenAI).mockImplementation(function () {
      return {
        models: {
          generateContent: generateContentMock,
        },
      } as any;
    });
  });

  test("must call the google API with the loaded template and return the refined prompt", async () => {
    const mockTemplate = "Template mockado com {{ASSEMBLED_PROMPT}}";
    const mockRefinedText = "Texto refinado pela IA";

    vi.mocked(loadTemplate).mockResolvedValue(mockTemplate);

    generateContentMock.mockResolvedValue({
      text: mockRefinedText,
    });

    const result = await PromptRefiner.refine("meu prompt original");

    expect(result).toBe(mockRefinedText);

    expect(loadTemplate).toHaveBeenCalled();

    expect(generateContentMock).toHaveBeenCalledWith({
      model: "gemini-2.0-flash",
      contents: "Template mockado com meu prompt original",
    });
  });

  test("must throw an error if the template loading fails", async () => {
    const templateError = new Error("Template file not found");
    vi.mocked(loadTemplate).mockRejectedValue(templateError);

    await expect(PromptRefiner.refine("any prompt")).rejects.toThrow(
      "Template file not found"
    );
  });

  test("must throw a specific error if the Google API fails", async () => {
    vi.mocked(loadTemplate).mockResolvedValue("template {{ASSEMBLED_PROMPT}}");

    const apiError = new Error("API connection failed");
    generateContentMock.mockRejectedValue(apiError);

    await expect(PromptRefiner.refine("any prompt")).rejects.toThrow(
      "Failed to refine prompt with AI (preserving structure)."
    );
  });

  test("must throw an error if the AI returns empty text", async () => {
    vi.mocked(loadTemplate).mockResolvedValue("template {{ASSEMBLED_PROMPT}}");

    generateContentMock.mockResolvedValue({
      text: "",
    });

    await expect(PromptRefiner.refine("any prompt")).rejects.toThrow(
      "Failed to refine prompt with AI (preserving structure)"
    );
  });
});
