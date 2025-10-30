import { GoogleGenAI } from "@google/genai";
import { config } from "../config";
import fs from "fs/promises";
import path from "path";
import { loadTemplate } from "../utils/loadTemplate";

const API_KEY = config.GEMINI_API_KEY;

const templatePath = path.resolve(
  __dirname,
  "../prompt_templates/refine_prompt_markdown.txt"
);

let promptTemplate: string | null = null;

export class PromptRefiner {
  public static async refine(assembledPrompt: string): Promise<string> {
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

    const promptParaIA = template.replace(
      "{{ASSEMBLED_PROMPT}}",
      assembledPrompt
    );

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: promptParaIA,
      });

      const text = response.text;

      if (!text) {
        throw new Error("AI did not return text for the refined prompt.");
      }

      if (!text.includes(":") || !text.includes("-------")) {
        console.warn(
          "AI response might not have maintained the expected Markdown structure."
        );
      }
      return text.trim();
    } catch (error) {
      console.error(
        "Error calling Gemini API for refinement (Markdown structure):",
        error
      );
      throw new Error(
        "Failed to refine prompt with AI (preserving structure)."
      );
    }
  }
}
