"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "./schema";
import { toast } from "sonner";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import MicrositeAdditionalFields from "../../../common/components/microsite-additional-fields-update";
import { useEffect, useCallback } from "react";

interface CreateFormProps extends FormBaseProps<UpdateSchema> {
  saveForm: boolean;
}

export default function UpdateMicrositeAdditionalFieldsForm({
  defaultValues,
  onSuccess,
  saveForm,
}: CreateFormProps) {
  const form = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: defaultValues as UpdateSchema,
  });

  const handleSubmit = useCallback(
    async (data: UpdateSchema) => {
      try {
        await updateAction({ data });
        toast.success(`Faculty section updated`);
        onSuccess?.();
      } catch (error) {
        console.error("Error updating faculty section:", error);
        toast.error("Error updating faculty section");
      }
    },
    [onSuccess]
  );

  // Reset form when defaultValues change (e.g., after reload)
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues as UpdateSchema);
    }
  }, [defaultValues, form]);

  useEffect(() => {
    if (saveForm) {
      form.handleSubmit(handleSubmit)();
    }
  }, [saveForm, form, handleSubmit]);

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <MicrositeAdditionalFields
          form={form}
          top_desc_field_name="top_description"
          bottom_desc_field_name="bottom_description"
        />
      </div>
    </form>
  );
}
