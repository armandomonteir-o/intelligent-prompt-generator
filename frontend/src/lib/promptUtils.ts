import type { PromptSectionType } from "@/types/prompt.schema";

export const assemblePromptString = (sections: PromptSectionType[]): string => {
  const isIncomplete = sections.some((section) => !section.selectedValue);
  if (isIncomplete) {
    return "";
  }

  const allSectionsText = sections.map(
    (section) => `**${section.displayName}:**\n${section.selectedValue}`
  );

  const finalString = allSectionsText.join("\n\n------\n\n");
  return finalString;
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
};
