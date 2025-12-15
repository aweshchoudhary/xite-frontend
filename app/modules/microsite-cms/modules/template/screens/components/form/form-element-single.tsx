import { UseFormReturn, useFieldArray } from "react-hook-form";
import { TemplateFormInput } from "@/modules/common/services/db/actions/template/schema";
import FormElement from "./form-element";

type FieldArrayName =
  | `pages.${number}.sections.${number}.blocks.${number}.elements`
  | `globalSections.${number}.blocks.${number}.elements`;

interface FormSingleElementProps {
  form: UseFormReturn<TemplateFormInput>;
  fieldArrayName: FieldArrayName;
}

export default function FormSingleElement({
  form,
  fieldArrayName,
}: FormSingleElementProps) {
  const elementFields = useFieldArray({
    control: form.control,
    name: fieldArrayName,
  });

  if (!elementFields.fields.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-dashed border-border/50 bg-muted/40 p-4">
      <FormElement form={form} fieldArrayName={fieldArrayName} index={0} />
    </div>
  );
}
