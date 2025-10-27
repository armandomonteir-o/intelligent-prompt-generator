// src/services/promptService.ts
import type { SuggestionsType } from "@/types/prompt.schema";
import { ApiError, NetworkError } from "@/lib/errors";
import { marketingMockV2 } from "@/mocks/v2/marketingMockV2";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3005/api/prompts";

export const generateSuggestions = async (
  promptIdea: string
): Promise<SuggestionsType> => {
  if (import.meta.env.VITE_MOCK_API === "true") {
    console.warn("API (generateSuggestions) está em modo MOCK");
    return new Promise((resolve) =>
      setTimeout(() => resolve(marketingMockV2), 2000)
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ promptIdea }),
    });

    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({ error: "Falha ao ler corpo do erro" })); // Garante que errorBody exista
      const errorMessage =
        errorBody.error || `Erro ${response.status} do servidor`;
      throw new ApiError(errorMessage);
    }

    const backendResponse: SuggestionsType = await response.json();
    return backendResponse;
  } catch (error) {
    if (error instanceof ApiError || error instanceof NetworkError) {
      throw error;
    }

    console.error("Falha na chamada de rede para gerar sugestões:", error);
    throw new NetworkError();
  }
};

export const refinePrompt = async (
  assembledPrompt: string
): Promise<string> => {
  if (import.meta.env.VITE_MOCK_API === "true") {
    console.warn("API (refinePrompt) está em modo MOCK");
    return new Promise((resolve) =>
      setTimeout(() => resolve(`Mock simples: ${assembledPrompt}`), 1000)
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/refine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ promptToRefine: assembledPrompt }),
    });

    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({ error: "Falha ao ler corpo do erro" }));
      const errorMessage =
        errorBody.error || `Erro ${response.status} do servidor`;
      throw new ApiError(errorMessage);
    }

    const backendResponse: { refinedPrompt: string } = await response.json();

    if (!backendResponse.refinedPrompt) {
      throw new ApiError(
        "Resposta da API de refinamento não contém 'refinedPrompt'."
      );
    }

    return backendResponse.refinedPrompt;
  } catch (error) {
    if (error instanceof ApiError || error instanceof NetworkError) {
      throw error;
    }
    console.error("Falha na chamada de rede para refinar prompt:", error);
    throw new NetworkError();
  }
};
