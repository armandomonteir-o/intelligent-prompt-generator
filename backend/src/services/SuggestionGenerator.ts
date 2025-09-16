import { GoogleGenAI } from "@google/genai";
import { promptResponseSchema } from "src/types/prompt.schema";
import type { PromptSectionType } from "src/types/prompt.schema";

const API_KEY = process.env.GEMINI_API_KEY;

export class SuggestionsGenerator {
  public static async generate(
    promptIdea: string
  ): Promise<PromptSectionType[]> {
    if (!API_KEY) {
      throw new Error("Chave de API não encontrada");
    }

    const genAI = new GoogleGenAI({ apiKey: API_KEY });

    const promptParaIA = `
  Sua tarefa é:
  Baseado na seguinte ideia: "${promptIdea}"
  ...
  Retorne APENAS um objeto JSON no seguinte formato:
  [
    { "id": "role", "displayName": "Papel (Role)", "suggestions": [...] },
    ...
  ]
`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: promptParaIA,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Requisição para a IA não teve sucesso");
    }

    try {
      const jsonData = JSON.parse(text);
      const suggestions: PromptSectionType[] =
        promptResponseSchema.parse(jsonData);
      console.log(suggestions);
      return suggestions;
    } catch (error) {
      console.log("Falha ao fazer o parsing ou validar o JSON da IA: ", text);
      console.error(error);
      throw new Error(
        "A IA retornou uma resposta em formato inválido ou inesperado."
      );
    }
  }
}
