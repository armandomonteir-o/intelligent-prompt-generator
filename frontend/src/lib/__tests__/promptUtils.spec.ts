import { describe, it, expect } from "vitest";
import { assemblePromptString } from "../promptUtils";
import type { PromptSectionType } from "../../types/prompt.schema";

describe("promptUtils", () => {
  describe("assemblePromptString", () => {
    it("should return an empty string if the sections array is empty", () => {
      const result = assemblePromptString([]);
      expect(result).toBe("");
    });

    it("should return an empty string if any section has missing selected value (incomplete form)", () => {
      const incompleteSections: PromptSectionType[] = [
        {
          id: "role",
          displayName: "Role",
          suggestions: [],
          selectedValue: "Software Engineer",
        },
        {
          id: "objective",
          displayName: "Objective",
          suggestions: [],
          selectedValue: "",
        },
      ];

      const result = assemblePromptString(incompleteSections);
      expect(result).toBe("");
    });

    it("should return a correctly formatted markdown string when all sections are valid", () => {
      const validSections: PromptSectionType[] = [
        {
          id: "role",
          displayName: "Role",
          suggestions: [],
          selectedValue: "Backend Developer",
        },
        {
          id: "objective",
          displayName: "Objective",
          suggestions: [],
          selectedValue: "Write integration tests",
        },
      ];

      const expectedOutput =
        "**Role:**\nBackend Developer\n\n------\n\n**Objective:**\nWrite integration tests";

      const result = assemblePromptString(validSections);

      expect(result).toBe(expectedOutput);
    });
  });
});
