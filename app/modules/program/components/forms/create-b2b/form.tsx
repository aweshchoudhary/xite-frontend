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
import { useEffect, useMemo } from "react";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { useRouter } from "next/navigation";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { getRequiredFields } from "@/modules/common/lib/zod-required-field-checker";
import { Badge } from "@ui/badge";
import { X } from "lucide-react";

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
      tags: defaultValues?.tags ?? [],
    },
  });

  const { closeModal, redirect } = useFormState();
  const router = useRouter();

  const requiredFields = useMemo(
    () => getRequiredFields(programCreateSchema),
    []
  );

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

  const tags = form.watch("tags") || [];

  const addTag = () => {
    const input = document.getElementById("tag-input") as HTMLInputElement;
    const value = input?.value?.trim();
    if (value && !tags.includes(value)) {
      form.setValue("tags", [...tags, value]);
      input.value = "";
    }
  };

  const removeTag = (tag: string) => {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tag)
    );
  };

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
                <FieldLabel isRequired={requiredFields.includes("name")}>
                  Name
                </FieldLabel>
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
                <FieldLabel isRequired={requiredFields.includes("short_name")}>
                  Program Short Name
                </FieldLabel>
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
                <FieldLabel isRequired={requiredFields.includes("type")}>
                  Type
                </FieldLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
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
                <FieldLabel
                  isRequired={requiredFields.includes("academic_partner_id")}
                >
                  Academic Partner
                </FieldLabel>
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
                  <FieldLabel
                    isRequired={requiredFields.includes("enterprise_id")}
                  >
                    Enterprise
                  </FieldLabel>
                  <EnterpriseSelect formField={field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        )}
        <div className="col-span-2">
          <Field>
            <FieldLabel>Tags</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="tag-input"
                placeholder="Add tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </Field>
        </div>
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
