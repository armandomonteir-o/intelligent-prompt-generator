import type { PromptSectionType } from "@/types/prompt";
import { Textarea } from "@/components/ui/textarea";

type PromptSectionProps = {
  section: PromptSectionType;
  onValueChange: (id: string, newValue: string) => void;
};

function PromptSection(props: PromptSectionProps) {
  console.log(props);
  return (
    <>
      <h2>{props.section.displayName}</h2>
      <Textarea
        placeholder={props.section.placeholder}
        value={props.section.selectedValue ?? ""}
        onChange={(e) => props.onValueChange(props.section.id, e.target.value)}
      ></Textarea>
    </>
  );
}

export default PromptSection;
