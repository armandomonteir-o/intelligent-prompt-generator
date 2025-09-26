import type { PromptSectionType } from "@/types/prompt.schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PromptSection from "../PromptSection";

type SuggestionsAccordionProps = {
  sections: PromptSectionType[];
  onSectionChange: (sectionId: string, newValue: string) => void;
};

export function SuggestionsAccordion({
  sections,
  onSectionChange,
}: SuggestionsAccordionProps) {
  {
    return (
      <Accordion type="multiple" className="w-max p-2">
        {sections.map((section) => (
          <AccordionItem key={section.id} value={`item-${section.id}`}>
            <AccordionTrigger className="text-md font-semibold">
              <h2>{section.displayName} </h2>
            </AccordionTrigger>
            <AccordionContent>
              <PromptSection
                section={section}
                onValueChange={onSectionChange}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }
}
