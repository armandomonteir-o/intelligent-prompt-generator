import { GoogleGenAI } from "@google/genai";
import { config } from "src/config";

const API_KEY = config.GEMINI_API_KEY;

export class PromptRefiner {
  public static async refine(assembledPrompt: string): Promise<string> {
    if (!API_KEY) {
      throw new Error("Chave de API não encontrada");
    }

    const genAI = new GoogleGenAI({ apiKey: API_KEY });

    const promptParaIA = `
      Você é um especialista em engenharia de prompts. Sua tarefa é reescrever o prompt estruturado abaixo, tornando-o mais coeso, natural e eficaz.
      Combine as seções de forma fluida, sem apenas listá-las. Mantenha o significado original de cada seção.
      Se o prompt incluir uma instrução para "pensar passo a passo", mantenha-a no início do prompt final.

      PROMPT ORIGINAL ESTRUTURADO:
      \`\`\`
      ${assembledPrompt}
      \`\`\`

      REESCREVA O PROMPT ABAIXO:
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: promptParaIA,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Requisição para a IA não teve sucesso");
    }

    return text;
  }
}
