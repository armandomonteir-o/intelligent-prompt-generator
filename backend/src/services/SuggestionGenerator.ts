import { GoogleGenAI } from "@google/genai";
import {
  promptResponseSchema,
  suggestionsSchema,
} from "../types/prompt.schema";
import type { PromptSectionType } from "../types/prompt.schema";
import type { SuggestionsType } from "../types/prompt.schema";
import { config } from "../config";
import path from "path";
import { loadTemplate } from "../utils/loadTemplate";

const API_KEY = config.GEMINI_API_KEY;

const templatePath = path.resolve(
  __dirname,
  "../prompt_templates/generate_suggestions_markdown.txt"
);

export class SuggestionsGenerator {
  public static async generate(promptIdea: string): Promise<SuggestionsType> {
    if (!API_KEY) {
      throw new Error("Chave de API não encontrada");
    }

    const genAI = new GoogleGenAI({ apiKey: API_KEY });

    let template: string;

    try {
      template = await loadTemplate(templatePath);
    } catch (error) {
      console.error("Falha ao obter template no PromptRefiner.");
      throw error;
    }

    const promptParaIA = template.replace("{{promptIdea}}", promptIdea);

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: promptParaIA,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Requisição para a IA não teve sucesso");
    }

    try {
      const cleanText = text.replace("```json", "").replace("```", "").trim();
      const jsonData = JSON.parse(cleanText);
      const suggestions: SuggestionsType = suggestionsSchema.parse(jsonData);
      return suggestions;
    } catch (error) {
      throw new Error(
        "A IA retornou uma resposta em formato inválido ou inesperado."
      );
    }
  }
}
