import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { PromptSectionType, SuggestionsType } from "@/types/prompt.schema";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { INITIAL_SECTIONS } from "@/data/promptStructure";
import { assemblePromptString } from "@/lib/promptUtils";
import { HelpInfoSheet } from "../HelpInfoSheet";
import { ApiError, NetworkError } from "@/lib/errors";
import { FinalPromptDisplay } from "../FinalPromptDisplay";
import { SuggestionsAccordion } from "../SuggestionsAccordion";
import { generateSuggestions, refinePrompt } from "@/services/promptService";

function PromptGenerator() {
  const [promptIdea, setPromptIdea] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sections, setSections] =
    useState<PromptSectionType[]>(INITIAL_SECTIONS);
  const [finalPrompt, setFinalPrompt] = useState<string>("");
  const [addThinkingStep, setaddThinkingStep] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptIdea(event.target.value);
  };

  const hasSuggestions = sections.some(
    (section) => section.suggestions.length > 0
  );

  const handleGenerateSections = async () => {
    try {
      setSections(INITIAL_SECTIONS);
      setFinalPrompt("");
      setIsLoading(true);

      if (!promptIdea) {
        toast.error("Insira um prompt");
        return;
      }

      const suggestionsFromAPI: SuggestionsType = await generateSuggestions(
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
      if (e instanceof ApiError || e instanceof NetworkError) {
        toast.error(e.message);
      } else {
        toast.error("Ocorreu um erro inesperado");
        console.error("Erro não capturado:", e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionChange = (sectionId: string, newValue: string) => {
    setFinalPrompt("");
    setSections((currentSections) =>
      currentSections.map((section) =>
        section.id === sectionId
          ? { ...section, selectedValue: newValue }
          : section
      )
    );
  };

  const handleAssemblePrompt = async () => {
    const mountedPrompt = assemblePromptString(sections);

    if (!mountedPrompt) {
      toast.error(
        "Por favor, preencha todas as seções antes de montar o prompt"
      );
      return;
    }

    let promptToRefine = mountedPrompt;

    if (addThinkingStep) {
      const thinkingStep =
        "**Pense passo a passo antes de me dar a resposta final, detalhando seu raciocínio para garantir a melhor qualidade possível na resposta.** \n\n------\n\n";

      promptToRefine = thinkingStep + promptToRefine;
    }

    setIsRefining(true);
    setFinalPrompt("");

    try {
      const iaMadePrompt = await refinePrompt(promptToRefine);
      setFinalPrompt(iaMadePrompt);
      toast.success("Prompt gerado com sucesso");
    } catch (e) {
      if (e instanceof ApiError || e instanceof NetworkError) {
        toast.error(e.message);
      } else {
        toast.error("Ocorreu um erro inesperado ao refinar o prompt.");
        console.error("Erro ao refinar:", e);
      }
    } finally {
      setIsRefining(false);
    }
  };

  const isFormComplete =
    sections.length > 0 && sections.every((section) => section.selectedValue);

  const handleCheckedChange = (checked: boolean | "indeterminate") => {
    setFinalPrompt("");
    setaddThinkingStep(checked === true);
  };
  return (
    <>
      <HelpInfoSheet />
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
          onClick={handleGenerateSections}
          variant={"outline"}
          size={"lg"}
          disabled={isLoading || promptIdea === ""}
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
          <>
            <SuggestionsAccordion
              sections={sections}
              onSectionChange={handleSectionChange}
            />
            <div>
              <Checkbox
                id="checkbox"
                checked={addThinkingStep}
                onCheckedChange={handleCheckedChange}
                className="bg-slate-300 mr-2 cursor-pointer"
              />
              <label
                className="text-md font-semibold select-none cursor-pointer"
                htmlFor="checkbox"
              >
                Ativar "Think before answer"
              </label>
            </div>
          </>
        )}

        {isFormComplete && !isLoading && (
          <Button
            size={"lg"}
            onClick={handleAssemblePrompt}
            disabled={isRefining}
          >
            {isRefining ? (
              <>
                <Loader2 className=" size-4 animate-spin" />
              </>
            ) : (
              <span>Montar Prompt Final</span>
            )}
          </Button>
        )}

        {!isRefining && <FinalPromptDisplay finalPrompt={finalPrompt} />}
      </div>
    </>
  );
}

export default PromptGenerator;
