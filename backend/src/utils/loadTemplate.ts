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
      `Erro crítico ao carregar o template do prompt: ${normalizedPath}`,
      error
    );

    let errorMessage = "Um erro desconhecido ocorreu ao carregar o template.";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    throw new Error(
      `Não foi possível carregar o template do prompt em: ${normalizedPath}. Detalhes: ${errorMessage}`
    );
  }
}

export function clearTemplateCache() {
  templateCache.clear();
  console.log("Cache de templates limpo.");
}
