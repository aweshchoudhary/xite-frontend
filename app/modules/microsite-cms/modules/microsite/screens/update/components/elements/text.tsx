import { Input } from "@ui/input";
import { ITemplateElement } from "@/modules/common/services/db/types/interfaces";

interface TextElementProps {
  index: number;
  //  eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  element: ITemplateElement;
}
export default function TextElement({
  index,
  element,
  field,
}: TextElementProps) {
  return (
    <Input
      {...field}
      id={`${field.name}-${index}-${element.key}`}
      value={(field.value as string) || ""}
      aria-invalid={field.invalid}
      placeholder={`Enter ${element.title.toLowerCase()}`}
    />
  );
}
