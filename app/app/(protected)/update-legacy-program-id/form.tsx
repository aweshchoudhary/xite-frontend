"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UpdateSchema, updateSchema } from "./schema";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/modules/common/components/ui/field";
import { Input } from "@/modules/common/components/ui/input";
import { updateAction } from "./action";
import { Button } from "@/modules/common/components/ui/button";
import { toast } from "sonner";

export default function Form() {
  const form = useForm<UpdateSchema>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      program_key: "",
      program_sf_key: "",
    },
  });

  const handleSubmit = async (data: UpdateSchema) => {
    toast.promise(updateAction(data), {
      loading: "Updating legacy program ID...",
      success: "Legacy program ID updated successfully",
      error: "Failed to update legacy program ID",
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-8">
        <Controller
          control={form.control}
          name="program_key"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel isRequired={true}>Program Key</FieldLabel>
              <Input placeholder="Name" {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="program_sf_key"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel isRequired={true}>Program SF Key</FieldLabel>
              <Input placeholder="Name" {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit">Update Legacy Program ID</Button>
      </div>
    </form>
  );
}
