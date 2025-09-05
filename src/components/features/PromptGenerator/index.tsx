import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { PromptSectionType } from "@/types/prompt";
import PromptSection from "../PromptSection";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const generateSuggestionsAPI = (
  prompt: string
): Promise<PromptSectionType[]> => {
  console.log("Enviando para a IA:", prompt);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        resolve([
          {
            id: "role",
            displayName: "Papel (Role)",
            placeholder: "Ex: Aja como um especialista em marketing digital...",
            suggestions: [
              {
                id: "12",
                text: "Aja como um Marinheiro experiente em embarcações",
              },
            ],
            selectedValue: "",
          },
          {
            id: "objective",
            displayName: "Objetivo (Objective)",
            placeholder: "Ex: Criar 5 slogans para uma nova marca de café...",
            suggestions: [
              {
                id: "22",
                text: "Criar um foguete espacial",
              },
            ],
            selectedValue: "",
          },
          {
            id: "audience",
            displayName: "Público (Audience)",
            placeholder: "Ex: O público-alvo são jovens de 18 a 25 anos...",
            suggestions: [
              {
                id: "25",
                text: "Destinado a entusiastas em física quantica",
              },
            ],
            selectedValue: "",
          },
        ]);
      } else {
        reject(
          new Error("A IA está sobrecarregada. Tente novamente mais tarde.")
        );
      }
    }, 2000);
  });
};

function PromptGenerator() {
  const [promptIdea, setPromptIdea] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sections, setSections] = useState<PromptSectionType[]>([]);
  const [isError, setIsError] = useState<string | null>(null);

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

  return (
    <div>
      <h1>Intelligent Prompt Generator</h1>
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
      >
        Gere o esquema do Prompt
      </Button>

      {isLoading ? (
        <p>Carregando sugestões...</p>
      ) : sections.length === 0 ? (
        <p>Suas sugestões aparecerão aqui.</p>
      ) : (
        <Accordion type="multiple">
          {sections.map((section) => (
            <AccordionItem key={section.id} value={`item-${section.id}`}>
              <AccordionTrigger>{section.displayName} </AccordionTrigger>
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

      {isError && <p className="text-red-500">Erro: {isError}</p>}
    </div>
  );
}

export default PromptGenerator;
