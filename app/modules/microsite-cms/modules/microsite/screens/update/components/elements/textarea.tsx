import { ITemplateElement } from "@microsite-cms/common/services/db/types/interfaces";
import { Textarea } from "@ui/textarea";

interface TextareaElementProps {
  index: number;
  //  eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  element: ITemplateElement;
}
export default function TextareaElement({
  index,
  element,
  field,
}: TextareaElementProps) {
  return (
    <Textarea
      {...field}
      id={`${field.name}-${index}-${element.key}`}
      value={(field.value as string) || ""}
      aria-invalid={field.invalid}
      placeholder={`Enter ${element.title.toLowerCase()}`}
    />
  );
}
