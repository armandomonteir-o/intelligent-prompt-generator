import type { PromptSectionType } from "@/types/prompt.schema";

export const INITIAL_SECTIONS: PromptSectionType[] = [
  {
    id: "role",
    displayName: "Papel (Role)",
    suggestions: [],
    selectedValue: null,
  },
  {
    id: "objective",
    displayName: "Objetivo (Objective)",

    suggestions: [],
    selectedValue: null,
  },
  {
    id: "audience",
    displayName: "Público (Audience)",
    suggestions: [],
    selectedValue: null,
  },
  {
    id: "style",
    displayName: "Estilo (Style)",
    suggestions: [],
    selectedValue: null,
  },
  {
    id: "outputFormat",
    displayName: "Formato de Resposta (Output Format)",
    suggestions: [],
    selectedValue: null,
  },
];
