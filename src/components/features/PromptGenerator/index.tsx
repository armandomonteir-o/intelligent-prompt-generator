import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const generateSuggestionsAPI = (prompt: string): Promise<string[]> => {
  console.log("Enviando para a IA:", prompt);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        resolve([
          `Sugestão baseada em: '${prompt}' - Persona: Um cão surfista.`,
          "Contexto: Numa entrevista de emprego.",
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
      setSuggestions([]);
      setIsError(null);
      setIsLoading(true);
      const data = await generateSuggestionsAPI(promptIdea);
      setSuggestions(data);
    } catch (e) {
      if (e instanceof Error) {
        setIsError(e.message);
      }
    } finally {
      setIsLoading(false);
    }

    /*setIsLoading(true);
    setSuggestions([]);
    setTimeout(() => {
      setIsLoading(false);
      setSuggestions(mockData);
    }, 2000); */
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
        Gere seu prompt
      </Button>

      {isLoading ? (
        <p>Carregando sugestões...</p>
      ) : suggestions.length === 0 ? (
        <p>Suas sugestões aparecerão aqui.</p>
      ) : (
        suggestions.map((suggestion) => <li>suggestion: {suggestion} </li>)
      )}

      {isError && <p className="text-red-500">Erro: {isError}</p>}
    </div>
  );
}

export default PromptGenerator;
