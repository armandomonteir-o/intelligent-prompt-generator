import fs from "fs/promises";
import path from "path";

const templateCache = new Map<string, string>();

export async function loadTemplate(templatePath: string) {
  const normalizedPath = path.resolve(templatePath);

  if (templateCache.has(normalizedPath)) {
    return templateCache.get(normalizedPath)!;
  }

  try {
    const promptTemplate = await fs.readFile(normalizedPath, "utf-8");

    templateCache.set(normalizedPath, promptTemplate);

    return promptTemplate;
  } catch (error) {
    console.error(
      `Critical error trying to load the template: ${normalizedPath}`,
      error
    );

    let errorMessage =
      "An unknown error happened when trying to load the template";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    throw new Error(
      `Could not load prompt template at: ${normalizedPath}. Details: ${errorMessage}`
    );
  }
}

export function clearTemplateCache() {
  templateCache.clear();
  console.log("Template cache cleared");
}
