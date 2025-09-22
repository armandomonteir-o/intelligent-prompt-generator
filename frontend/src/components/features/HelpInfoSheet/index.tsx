import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Accordion } from "@radix-ui/react-accordion";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type HelpContentItem = {
  title: string;
  description: string;
};

const helpContent: HelpContentItem[] = [
  {
    title: "Papel",
    description: "Defina a profissão da sua IA",
  },
  {
    title: "Objetivo",
    description:
      "Define o objetivo do seu prompt, para que você está solicitando ajuda da IA? qual o Intuito?",
  },
];

export function HelpInfoSheet() {
  return (
    <Sheet modal={false}>
      <SheetTrigger>
        <Button className="absolute top-4 right-4 ">
          <HelpCircle />
        </Button>
      </SheetTrigger>
      <SheetContent
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
        className="bg-primary-foreground w-[350px]"
      >
        <Accordion type="single" collapsible>
          {helpContent.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={item.title}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.description}</AccordionContent>
            </AccordionItem>
          ))}{" "}
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}
