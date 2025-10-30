import { z } from "zod";

const suggestionObjectSchema = z.object({
  id: z.string(),
  text: z.string(),
});

const promptSectionSchema = z.object({
  id: z.literal(["role", "objective", "audience", "style", "outputFormat"]),
  displayName: z.string(),
  suggestions: z.array(suggestionObjectSchema),
  selectedValue: z.string().nullable(),
});

export const suggestionsSchema = z.object({
  role: z.array(z.string()),
  objective: z.array(z.string()),
  audience: z.array(z.string()),
  style: z.array(z.string()),
  outputFormat: z.array(z.string()),
});

export type SuggestionsType = z.infer<typeof suggestionsSchema>;

export const promptResponseSchema = z.array(promptSectionSchema);

export type PromptSectionType = z.infer<typeof promptSectionSchema>;
