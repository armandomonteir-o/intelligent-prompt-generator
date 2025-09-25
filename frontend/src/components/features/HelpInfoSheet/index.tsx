import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Accordion } from "@radix-ui/react-accordion";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { helpContent } from "@/data/helpContent";
import React from "react";

export function HelpInfoSheet() {
  return (
    <Sheet modal={false}>
      <SheetTrigger>
        <Button variant={"ghost"} className=" absolute top-6 right-6 ">
          <HelpCircle className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
        className="bg-card w-[350px] p-4"
      >
        <SheetHeader>
          <SheetTitle className="text-xl">
            Guia de Criatividade para Prompts
          </SheetTitle>
          <SheetDescription>
            Informativo sobre o que você precisa saber para extrair o máximo de
            uma IA.
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto custom-scrollbar">
          <Accordion type="single" collapsible className="text-center p-4">
            {helpContent.map((group) => (
              <React.Fragment key={group.groupTitle}>
                <div className="my-4 border-b">
                  <h4 className="text-sm font-bold text-muted-foreground py-2">
                    {group.groupTitle}
                  </h4>
                </div>
                {group.items.map((item, index) => (
                  <AccordionItem
                    value={`item-${group.groupTitle}-${index}`}
                    key={item.title}
                    className="mb-4"
                  >
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>{item.description}</AccordionContent>
                  </AccordionItem>
                ))}
              </React.Fragment>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
