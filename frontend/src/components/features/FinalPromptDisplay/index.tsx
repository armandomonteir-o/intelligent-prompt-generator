import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

type FinalPromptDisplayProps = {
  finalPrompt: string;
};

export function FinalPromptDisplay({ finalPrompt }: FinalPromptDisplayProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

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
    finalPrompt != "" && (
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
    )
  );
}
