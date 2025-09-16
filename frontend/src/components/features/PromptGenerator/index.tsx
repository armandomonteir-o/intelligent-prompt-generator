import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { PromptSectionType } from "@/types/prompt.schema";
import PromptSection from "../PromptSection";
import { toast } from "sonner";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CopyIcon, CheckIcon, Loader2 } from "lucide-react";

const generateSuggestionsAPI = async (
  prompt: string
): Promise<PromptSectionType[]> => {
  console.log("Enviando para a o backend:", prompt);

  const response = await fetch("http://localhost:3005/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ promptIdea: prompt }),
  });

  if (!response.ok) {
    throw new Error("O servidor respondeu com um erro. Tente novamente.");
  }

  const backendResponse: PromptSectionType[] = await response.json();
  console.log("resposta do backend:", backendResponse);

  return backendResponse;
};

function PromptGenerator() {
  const [promptIdea, setPromptIdea] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sections, setSections] = useState<PromptSectionType[]>([]);
  const [isError, setIsError] = useState<string | null>(null);
  const [finalPrompt, setFinalPrompt] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptIdea(event.target.value);
  };

  /*const mockData = [
    "Persona: Um pirata filosófico",
    "Contexto: Numa reunião de RH",
    "Tarefa: Escrever um email passivo-agressivo",
  ];*/

  const handleGenerate = async () => {
    try {
      setSections([]);
      setFinalPrompt("");
      setIsError(null);
      setIsLoading(true);
      const data = await generateSuggestionsAPI(promptIdea);
      setSections(data);
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
    const isIncomplete = sections.some((section) => !section.selectedValue);
    if (isIncomplete) {
      toast.error(
        "Por favor, preencha todas as seções antes de montar o prompt"
      );
      return;
    }

    const allSectionsText = sections.map(
      (section) => `**${section.displayName}:**\n${section.selectedValue}`
    );

    const finalString = allSectionsText.join("\n\n");
    setFinalPrompt(finalString);
  };

  const isFormComplete =
    sections.length > 0 && sections.every((section) => section.selectedValue);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalPrompt).then(() => {
      toast.success("Prompt copiado para a área de transferência!");
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
      ) : sections.length === 0 ? (
        <p>Suas sugestões aparecerão aqui.</p>
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
