import type { PromptSectionType } from "@/types/prompt.schema";

export const assemblePromptString = (sections: PromptSectionType[]): string => {
  const isIncomplete = sections.some((section) => !section.selectedValue);
  if (isIncomplete) {
    return "";
  }

  const allSectionsText = sections.map(
    (section) => `**${section.displayName}:**\n${section.selectedValue}`
  );

  const finalString = allSectionsText.join("\n\n");
  return finalString;
};
