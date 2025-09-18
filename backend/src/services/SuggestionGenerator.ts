import { GoogleGenAI } from "@google/genai";
import {
  promptResponseSchema,
  suggestionsSchema,
} from "../types/prompt.schema";
import type { PromptSectionType } from "../types/prompt.schema";
import type { SuggestionsType } from "../types/prompt.schema";
const API_KEY = process.env.GEMINI_API_KEY;

export class SuggestionsGenerator {
  public static async generate(promptIdea: string): Promise<SuggestionsType> {
    if (!API_KEY) {
      throw new Error("Chave de API não encontrada");
    }

    const genAI = new GoogleGenAI({ apiKey: API_KEY });

    const promptParaIA = `
// 1. ROLE PROMPTING
You are an expert creative assistant specializing in prompt engineering. Your primary function is to take a user's simple prompt idea and generate a JSON object containing creative suggestions based on it.

// 2. SYSTEM & CONTEXTUAL PROMPTING (INSTRUCTION-FOCUSED)
Your task is to generate exactly 3 creative and distinct suggestions for each of the 5 required keys: "role", "objective", "audience", "style", and "outputFormat".
Your entire response must be a single, valid JSON object that starts with '{' and ends with '}'. Adhere strictly to the schema and format demonstrated in the examples below.

// 3. FEW-SHOT PROMPTING (EXAMPLES)

---
EXAMPLE 1
USER INPUT: "a prompt to create a new brand design for a sustainable coffee shop"
EXPECTED JSON OUTPUT:
{
  "role": [
    "Act as a lead graphic designer specializing in eco-friendly and minimalist branding.",
    "Embody a marketing director for a disruptive, ethically-sourced coffee startup.",
    "Assume the persona of a brand consultant who helps sustainable companies tell their story."
  ],
  "objective": [
    "Generate 5 taglines and a mission statement for the brand.",
    "Create a primary color palette and a secondary font pairing for the visual identity.",
    "Design three distinct logo concepts that emphasize nature and sustainability."
  ],
  "audience": [
    "Target environmentally conscious millennials aged 25-40.",
    "Focus on local community members who value small, ethical businesses.",
    "Appeal to remote workers looking for a high-quality 'third space'."
  ],
  "style": [
    "The brand voice should be warm, authentic, and community-focused.",
    "Use a clean, modern, and slightly rustic aesthetic.",
    "Communicate with transparency and a passion for ethical sourcing."
  ],
  "outputFormat": [
    "A one-page brand guidelines document in Markdown.",
    "A JSON object containing the color palette (hex codes), font names, and taglines.",
    "A list of 10 social media post ideas to launch the new brand."
  ]
}
---

---
EXAMPLE 2
USER INPUT: "a prompt to explain recursion to a beginner programmer"
EXPECTED JSON OUTPUT:
{
  "role": [
    "Act as a computer science professor known for using great analogies.",
    "Assume the role of a senior developer mentoring a junior colleague.",
    "Embody a tech blogger who simplifies complex topics for a wide audience."
  ],
  "objective": [
    "Explain the concept of a 'base case' in recursion.",
    "Write a simple JavaScript function that demonstrates recursion by calculating a factorial.",
    "Describe a common pitfall of recursion, like infinite loops or stack overflow."
  ],
  "audience": [
    "A student in their first programming course.",
    "A self-taught developer transitioning from another career.",
    "Someone who understands basic loops (like 'for' and 'while') but is new to recursion."
  ],
  "style": [
    "Use a friendly, encouraging, and patient tone.",
    "Rely on a clear, real-world analogy (like Russian nesting dolls or a hall of mirrors).",
    "Avoid overly technical jargon where possible."
  ],
  "outputFormat": [
    "A series of numbered steps explaining the concept.",
    "A combination of a short explanation followed by a commented code block.",
    "A Q&A format with common questions a beginner might have."
  ]
}
---

// THE REAL TASK
Now, perform the same function for the following user input. Remember, your response must be only the JSON object.

USER INPUT:
"${promptIdea}"
`;
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
      console.log("JSON parseado e validado com sucesso!");
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
