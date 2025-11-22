import { expect, test, vi, describe, afterEach, beforeEach } from "vitest";
import { SuggestionsGenerator } from "../services/SuggestionGenerator";
import { GoogleGenAI } from "@google/genai";

vi.mock("@google/genai");
vi.mock("../utils/loadTemplate");

import { loadTemplate } from "../utils/loadTemplate";

describe("SuggestionsGenerator Service", () => {
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

  test("must return a valid Suggestions object when the API returns valid JSON", async () => {
    const mockPromptIdea = "Test Idea";
    const mockTemplate = "Template {{promptIdea}}";

    const mockResponseObj = {
      role: ["Role 1", "Role 2", "Role 3"],
      objective: ["Obj 1", "Obj 2", "Obj 3"],
      audience: ["Aud 1", "Aud 2", "Aud 3"],
      style: ["Style 1", "Style 2", "Style 3"],
      outputFormat: ["Format 1", "Format 2", "Format 3"],
    };

    const mockApiResponse = JSON.stringify(mockResponseObj);

    vi.mocked(loadTemplate).mockResolvedValue(mockTemplate);
    generateContentMock.mockResolvedValue({
      text: mockApiResponse,
    });

    const result = await SuggestionsGenerator.generate(mockPromptIdea);

    expect(result).toEqual(mockResponseObj);

    expect(result.role).toHaveLength(3);
    expect(loadTemplate).toHaveBeenCalled();
    expect(generateContentMock).toHaveBeenCalledWith({
      model: "gemini-2.0-flash",
      contents: expect.stringContaining(mockPromptIdea),
    });
  });

  test("must throw an error if the API returns invalid JSON (Parse Error)", async () => {
    vi.mocked(loadTemplate).mockResolvedValue("Template");

    generateContentMock.mockResolvedValue({
      text: "I am sorry, I cannot generate suggestions.",
    });

    await expect(SuggestionsGenerator.generate("idea")).rejects.toThrow(
      "A IA retornou uma resposta em formato inválido ou inesperado."
    );
  });

  test("must throw an error if the API returns JSON that does not match the Schema (Zod Error)", async () => {
    vi.mocked(loadTemplate).mockResolvedValue("Template");

    const invalidSchemaResponse = JSON.stringify({
      wrongKey: ["Nothing here"],
      anotherWrongKey: 123,
    });

    generateContentMock.mockResolvedValue({
      text: invalidSchemaResponse,
    });

    await expect(SuggestionsGenerator.generate("idea")).rejects.toThrow(
      "A IA retornou uma resposta em formato inválido ou inesperado."
    );
  });
});
