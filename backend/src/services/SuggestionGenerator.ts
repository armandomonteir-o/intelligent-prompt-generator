import { mockSuggestions } from "../mocks/suggestionsMock";
import { mockMarketing } from "../mocks/marketingMock";
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

export class SuggestionsGenerator {
  public static async generate(promptIdea: string) {
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

    /* const textoPrincipal = promptIdea;
    const palavraChave = "marketing";

    if (textoPrincipal.toLowerCase().includes(palavraChave)) {
      console.log("servindo o mock de marketing");
      return mockMarketing;
    } else {
      console.log("servindo o mock padrão.");
      return mockSuggestions;
    }
  } */
    console.log(text);
    return [text];
  }
}
