import { GoogleGenAI } from "@google/genai";
import { promptResponseSchema } from "../types/prompt.schema";
import type { PromptSectionType } from "../types/prompt.schema";

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
// 1. ROLE PROMPTING
You are an expert creative assistant specializing in prompt engineering. Your primary function is to take a user's simple prompt idea and expand it into a detailed, structured JSON object.

// 2. SYSTEM & CONTEXTUAL PROMPTING (INSTRUCTION-FOCUSED)
Your task is to generate 3 creative and distinct suggestions for each of the 5 required sections: "role", "objective", "audience", "style", and "outputFormat".

Your entire response will be a single, valid JSON array that starts with '[' and ends with ']'. Adhere strictly to the schema and format demonstrated in the examples below.

// 3. FEW-SHOT PROMPTING (EXAMPLES)

---
EXAMPLE 1
USER INPUT: "a prompt to create a new brand design"
EXPECTED JSON OUTPUT:
[
  {
    "id": "role",
    "displayName": "Role",
    "placeholder": "e.g., Act as a senior brand strategist...",
    "suggestions": [
      {"id": "brand-role-1", "text": "Act as a lead graphic designer specializing in minimalist logos."},
      {"id": "brand-role-2", "text": "Embody a marketing director for a disruptive tech startup."},
      {"id": "brand-role-3", "text": "Assume the persona of a brand consultant for sustainable companies."}
    ],
    "selectedValue": null
  },
  {
    "id": "objective",
    "displayName": "Objective",
    "placeholder": "e.g., Develop a complete visual identity...",
    "suggestions": [
      {"id": "brand-obj-1", "text": "Generate 5 taglines and a mission statement for the brand."},
      {"id": "brand-obj-2", "text": "Create a color palette and font pairing for the visual identity."},
      {"id": "brand-obj-3", "text": "Design three different logo concepts for a new coffee shop."}
    ],
    "selectedValue": null
  }
]
---

---
EXAMPLE 2
USER INPUT: "a prompt to explain a code concept"
EXPECTED JSON OUTPUT:
[
  {
    "id": "role",
    "displayName": "Role",
    "placeholder": "e.g., Act as a senior software engineer...",
    "suggestions": [
      {"id": "code-role-1", "text": "Act as a computer science professor teaching a beginner."},
      {"id": "code-role-2", "text": "Assume the role of a tech blogger explaining a concept with analogies."},
      {"id": "code-role-3", "text": "Embody a developer mentor conducting a code review."}
    ],
    "selectedValue": null
  },
  {
    "id": "objective",
    "displayName": "Objective",
    "placeholder": "e.g., Explain the concept of 'async/await'...",
    "suggestions": [
      {"id": "code-obj-1", "text": "Explain the difference between 'let', 'const', and 'var' in JavaScript."},
      {"id": "code-obj-2", "text": "Describe the concept of recursion using a real-world analogy."},
      {"id": "code-obj-3", "text": "Create a simple code example to demonstrate polymorphism in TypeScript."}
    ],
    "selectedValue": null
  }
]
---

// THE REAL TASK
Now, perform the same function for the following user input. Remember, your response must be only the JSON array.

USER INPUT:
"${promptIdea}"
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
      const cleanText = text.replace("```json", "").replace("```", "").trim();
      const jsonData = JSON.parse(cleanText);
      const suggestions: PromptSectionType[] =
        promptResponseSchema.parse(jsonData);
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
