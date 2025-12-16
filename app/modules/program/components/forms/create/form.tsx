"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { programCreateSchema, ProgramCreateSchema } from "../schema";
import { createProgramAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { ProgramType } from "@/modules/common/database/prisma/generated/prisma";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import AcademicPartnerSelect from "../../academic-partner-list";
import EnterpriseSelect from "@/modules/enterprise/components/select-list";
import { useEffect } from "react";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { useRouter } from "next/navigation";
import { Field, FieldError, FieldLabel } from "@ui/field";

type CreateFormProps = FormBaseProps<ProgramCreateSchema>;

export default function CreateForm({
  cancelRedirectPath,
  successRedirectPath,
  defaultValues,
}: CreateFormProps) {
  const form = useForm({
    resolver: zodResolver(programCreateSchema),
    defaultValues: {
      ...defaultValues,
      description: defaultValues?.description,
      type: defaultValues?.type ?? ProgramType.OPEN,
    },
  });

  const { closeModal, redirect } = useFormState();
  const router = useRouter();

  const handleSubmit = async (data: ProgramCreateSchema) => {
    toast.promise(submitHandler(data), {
      loading: "Creating program...",
      success: "Program created successfully",
      error: "Failed to create program",
    });
  };

  const submitHandler = async (data: ProgramCreateSchema) => {
    await createProgramAction(data);
    redirect(router, successRedirectPath);
    closeModal();
  };

  const handleCancel = () => {
    redirect(router, cancelRedirectPath);
    closeModal();
  };

  useEffect(() => {
    if (form.getValues("type") === ProgramType.CUSTOM) {
      form.setValue("enterprise_id", "");
    } else {
      form.setValue("enterprise_id", undefined);
    }
  }, [form.getValues("type")]);

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-8"
    >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input placeholder="Name" {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div>
            <Controller
              control={form.control}
              name="short_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Program Short Name</FieldLabel>
                  <Input
                    placeholder="e.g. Oxford SELP, MR Ross"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      form.setValue(
                        "program_key",
                        e.target.value.toLowerCase().replace(/ /g, "-")
                      );
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div>
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Type</FieldLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {Object.values(ProgramType).map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="capitalize"
                        >
                          {enumDisplay(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div>
            <Controller
              control={form.control}
              name="academic_partner_id"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Academic Partner</FieldLabel>
                  <AcademicPartnerSelect formField={field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          {form.watch("type") === ProgramType.CUSTOM && (
            <div className="col-span-2">
              <Controller
                control={form.control}
                name="enterprise_id"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Enterprise</FieldLabel>
                    <EnterpriseSelect formField={field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          )}
        </div>

        <footer className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {form.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </footer>
    </form>
  );
}
