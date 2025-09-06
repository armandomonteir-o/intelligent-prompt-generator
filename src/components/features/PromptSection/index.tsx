import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import type { PromptSectionType } from "@/types/prompt";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
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

type PromptSectionProps = {
  section: PromptSectionType;
  onValueChange: (id: string, newValue: string) => void;
};

function PromptSection(props: PromptSectionProps) {
  const [open, setOpen] = React.useState(false);
  console.log(props.section.selectedValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" w-full justify-between text-foreground"
        >
          <span className="truncate">
            {props.section.selectedValue
              ? props.section.selectedValue
              : `Selecione o ${props.section.displayName}...`}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Não está satisfeito? Escreva o seu ${props.section.displayName}`}
          />
          <CommandList>
            <CommandEmpty>`No {props.section.displayName} found`</CommandEmpty>
            <CommandGroup>
              {props.section.suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.id}
                  value={suggestion.text}
                  onSelect={(currentValue) => {
                    props.onValueChange(props.section.id, currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      props.section.selectedValue === suggestion.text
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {suggestion.text}
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
