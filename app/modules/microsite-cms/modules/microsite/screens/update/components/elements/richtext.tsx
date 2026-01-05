import { SimpleEditor } from "@tiptap-templates/simple/simple-editor";
import { ITemplateElement } from "@microsite-cms/common/services/db/types/interfaces";

interface RichTextElementProps {
  index: number;
  //  eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  element: ITemplateElement;
  isDisabled?: boolean;
}
export default function RichTextElement({
  index,
  element,
  field,
  isDisabled = false,
}: RichTextElementProps) {
  return (
    <SimpleEditor
      defaultValue={(field.value as string) || ""}
      onChange={(content) => field.onChange(content)}
      isDisabled={isDisabled}
    />
  );
}
