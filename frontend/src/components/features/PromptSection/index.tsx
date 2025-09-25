import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon, PlusCircleIcon } from "lucide-react";
import type { PromptSectionType } from "@/types/prompt.schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { capitalizeFirstLetter } from "@/lib/promptUtils";

type PromptSectionProps = {
  section: PromptSectionType;
  onValueChange: (id: string, newValue: string) => void;
};

function PromptSection(props: PromptSectionProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  console.log(props.section.selectedValue);

  const handleSelect = (currentValue: string) => {
    props.onValueChange(props.section.id, currentValue);
    setOpen(false);
  };

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const hasExistingSuggestion =
    !normalizedSearchQuery ||
    props.section.suggestions.some((suggestion) =>
      suggestion.text.trim().toLowerCase().includes(normalizedSearchQuery)
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" w-full max-w-80 justify-between text-foreground"
        >
          <span className="truncate">
            {props.section.selectedValue
              ? capitalizeFirstLetter(props.section.selectedValue)
              : `Selecione o ${props.section.displayName}...`}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0 max-w-80">
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={setSearchQuery}
            placeholder={`Não está satisfeito? Escreva o seu ${props.section.displayName}`}
          />
          <CommandList>
            <CommandGroup>
              <CommandItem
                key={"create-new"}
                value={searchQuery}
                onSelect={handleSelect}
                className={
                  hasExistingSuggestion ? "hidden" : "flex items-center"
                }
              >
                {props.section.selectedValue === searchQuery ? (
                  <CheckIcon className="mr-2 h-4 w-4" />
                ) : (
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                )}

                {props.section.selectedValue === searchQuery
                  ? capitalizeFirstLetter(searchQuery)
                  : `Criar: "${capitalizeFirstLetter(searchQuery)}"`}
              </CommandItem>
              {props.section.suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.id}
                  value={suggestion.text}
                  onSelect={handleSelect}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      props.section.selectedValue === suggestion.text
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {capitalizeFirstLetter(suggestion.text)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default PromptSection;
