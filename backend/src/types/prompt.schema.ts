import { z } from "zod";

const suggestionSchema = z.object({
  id: z.string(),
  text: z.string(),
});

const promptSectionSchema = z.object({
  id: z.literal(["role", "objective", "audience", "style", "outputFormat"]),
  displayName: z.string(),
  placeholder: z.string(),
  suggestions: z.array(suggestionSchema),
  selectedValue: z.string().nullable(),
});

export const promptResponseSchema = z.array(promptSectionSchema);

export type PromptSectionType = z.infer<typeof promptSectionSchema>;
