export type PromptSectionType = {
  id: "role" | "objective" | "audience" | "style" | "outputFormat";
  displayName: string;
  placeholder: string;
  suggestions: string[];
  selectedValue: string | null;
};
