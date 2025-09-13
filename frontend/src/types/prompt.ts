export type Suggestion = {
  id: string;
  text: string;
};

export type PromptSectionType = {
  id: "role" | "objective" | "audience" | "style" | "outputFormat";
  displayName: string;
  placeholder: string;
  suggestions: Suggestion[];
  selectedValue: string | null;
};
