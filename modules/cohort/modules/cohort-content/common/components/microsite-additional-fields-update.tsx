import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import { Button } from "@/modules/common/components/ui/button";
import { Label } from "@/modules/common/components/ui/label";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/modules/common/components/ui/field";

type Props = {
  form: UseFormReturn<any>;
  top_desc_field_name: string;
  bottom_desc_field_name: string;
};

export default function MicrositeAdditionalFields({
  form,
  top_desc_field_name,
  bottom_desc_field_name,
}: Props) {
  const [showAdditionalFields, setShowAdditionalFields] = useState({
    top_desc: form.getValues(top_desc_field_name) ? true : false,
    bottom_desc: form.getValues(bottom_desc_field_name) ? true : false,
  });

  console.log({
    top_desc: form.getValues(top_desc_field_name),
    bottom_desc: form.getValues(bottom_desc_field_name),
  });

  return (
    <div className="p-5 bg-muted/50 rounded-lg border-2 border-dashed mt-5">
      <h2>Microsite Section Fields (Optional)</h2>
      <div className="flex gap-2 my-4">
        <Button
          onClick={() => {
            setShowAdditionalFields({
              ...showAdditionalFields,
              top_desc: !showAdditionalFields.top_desc,
            });
            form.setValue(
              top_desc_field_name,
              showAdditionalFields.top_desc ? null : ""
            );
          }}
          variant="outline"
          size={"sm"}
          type="button"
        >
          {showAdditionalFields.top_desc
            ? "Remove Top Description"
            : "Add Top Description"}
        </Button>
        <Button
          onClick={() => {
            setShowAdditionalFields({
              ...showAdditionalFields,
              bottom_desc: !showAdditionalFields.bottom_desc,
            });
            form.setValue(
              bottom_desc_field_name,
              showAdditionalFields.bottom_desc ? null : ""
            );
          }}
          type="button"
          variant="outline"
          size={"sm"}
        >
          {showAdditionalFields.bottom_desc
            ? "Remove Bottom Description"
            : "Add Bottom Description"}
        </Button>
      </div>
      {showAdditionalFields.top_desc && (
        <div className="mb-6">
          <Controller
            control={form.control}
            name={top_desc_field_name}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="mb-2">Top Description</FieldLabel>
                <div>
                  <TextEditor
                    placeholder="Add a top description"
                    defaultValue={field.value}
                    formField={field}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      )}
      {showAdditionalFields.bottom_desc && (
        <div>
          <Controller
            control={form.control}
            name={bottom_desc_field_name}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="mb-2">Bottom Description</FieldLabel>
                <div>
                  <TextEditor
                    placeholder="Add a bottom description"
                    defaultValue={field.value}
                    formField={field}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      )}
    </div>
  );
}
