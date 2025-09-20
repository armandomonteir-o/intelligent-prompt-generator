import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { PromptSectionType, SuggestionsType } from "@/types/prompt.schema";
import PromptSection from "../PromptSection";
import { toast } from "sonner";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CopyIcon, CheckIcon, Loader2 } from "lucide-react";
import { marketingMockV2 } from "@/mocks/v2/marketingMockV2";
import { INITIAL_SECTIONS } from "@/data/promptStructure";
import { assemblePromptString } from "@/lib/promptUtils";

const generateSuggestionsAPI = async (
  prompt: string
): Promise<SuggestionsType> => {
  console.log("[API] - 1. A função generateSuggestionsAPI foi chamada.");
  if (import.meta.env.VITE_MOCK_API === "true") {
    console.warn("[API] - 2. MODO MOCK DETECTADO. Entrando no bloco 'if'.");
    console.log("[API] - 3. O mock que será retornado é:", marketingMockV2);
    console.warn("API está em modo MOCK");
    return new Promise((resolve) =>
      setTimeout(() => resolve(marketingMockV2), 2000)
    );
  }

  console.log(
    "[FETCH] 1. Iniciando a chamada fetch para http://localhost:3005/api"
  );
  console.log("Enviando para a o backend:", prompt);

  try {
    const response = await fetch("http://localhost:3005/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ promptIdea: prompt }),
    });

    console.log(
      "[FETCH] 2. Recebemos uma resposta! Objeto Response:",
      response
    );
    console.log(`[FETCH] 3. Status da resposta: ${response.status}`);
    console.log(`[FETCH] 4. Resposta OK?: ${response.ok}`);

    if (!response.ok) {
      console.error("[FETCH] 5. A resposta não foi OK. Lançando erro.");
      throw new Error("O servidor respondeu com um erro. Tente novamente.");
    }

    console.log("[FETCH] 6. A resposta foi OK. Tentando extrair o JSON...");
    const backendResponse: SuggestionsType = await response.json();
    console.log("resposta do backend:", backendResponse);

    return backendResponse;
  } catch (error) {
    console.error("[FETCH] X. CAIU NO CATCH! A chamada de rede falhou.", error);
    throw error;
  }
};

function PromptGenerator() {
  const [promptIdea, setPromptIdea] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sections, setSections] =
    useState<PromptSectionType[]>(INITIAL_SECTIONS);
  const [isError, setIsError] = useState<string | null>(null);
  const [finalPrompt, setFinalPrompt] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptIdea(event.target.value);
  };

  const hasSuggestions = sections.some(
    (section) => section.suggestions.length > 0
  );

  const handleGenerate = async () => {
    try {
      setSections(INITIAL_SECTIONS);
      setFinalPrompt("");
      setIsError(null);
      setIsLoading(true);

      const suggestionsFromAPI: SuggestionsType = await generateSuggestionsAPI(
        promptIdea
      );

      const updatedSections = INITIAL_SECTIONS.map((section) => {
        const newSuggestions = suggestionsFromAPI[section.id];

        return {
          ...section,
          suggestions: newSuggestions.map((text, index) => ({
            id: `${section.id}-${index}`,
            text,
          })),
        };
      });

      setSections(updatedSections);
    } catch (e) {
      if (e instanceof Error) {
        setIsError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionChange = (sectionId: string, newValue: string) => {
    setSections((currentSections) =>
      currentSections.map((section) =>
        section.id === sectionId
          ? { ...section, selectedValue: newValue }
          : section
      )
    );
  };

  const handleAssemblePrompt = () => {
    const finalString = assemblePromptString(sections);

    if (!finalString) {
      toast.error(
        "Por favor, preencha todas as seções antes de montar o prompt"
      );
      return;
    }

    setFinalPrompt(finalString);
  };

  const isFormComplete =
    sections.length > 0 && sections.every((section) => section.selectedValue);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalPrompt).then(() => {
      toast.success("Prompt copiado para a área de transferência!", {
        className: "opacity-50",
      });
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className=" w-full max-w-2xl bg-card p-8 rounded-xl shadow-lg space-y-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center ">
        Intelligent Prompt Generator
      </h1>
      <Textarea
        value={promptIdea}
        placeholder="Escreva a sua ideia"
        onChange={handleChange}
        disabled={isLoading}
      ></Textarea>
      <Button
        onClick={handleGenerate}
        variant={"outline"}
        size={"lg"}
        disabled={isLoading}
        className="min-w-[220px]"
      >
        {isLoading ? (
          <>
            <Loader2 className=" size-4 animate-spin" />
          </>
        ) : (
          <span>Gere o esquema do Prompt</span>
        )}
      </Button>

      {isLoading ? (
        <p>Carregando sugestões...</p>
      ) : !hasSuggestions ? (
        <p className="text-muted-foreground  mt-2 text-center opacity-75 italic">
          Digite uma ideia no campo acima e clique em "Gerar" para que a IA
          construa seu esquema de prompt.
        </p>
      ) : (
        <Accordion type="multiple" className="w-max p-2">
          {sections.map((section) => (
            <AccordionItem key={section.id} value={`item-${section.id}`}>
              <AccordionTrigger className="text-md font-semibold">
                <h2>{section.displayName} </h2>
              </AccordionTrigger>
              <AccordionContent>
                <PromptSection
                  section={section}
                  onValueChange={handleSectionChange}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {isFormComplete && (
        <Button onClick={handleAssemblePrompt}>Montar Prompt Final</Button>
      )}

      {finalPrompt != "" && (
        <div className=" bg-slate-200 dark:bg-slate-800 border rounded-md p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground"> Seu Prompt Final</h3>
            <Button onClick={handleCopy} variant={"default"} size={"icon"}>
              {isCopied ? (
                <CheckIcon className="size-4" />
              ) : (
                <CopyIcon className="size-4"></CopyIcon>
              )}
            </Button>
          </div>

          <pre className="text-sm whitespace-pre-wrap">{finalPrompt}</pre>
        </div>
      )}

      {isError && <p className="text-red-500">Erro: {isError}</p>}
    </div>
  );
}

export default PromptGenerator;
