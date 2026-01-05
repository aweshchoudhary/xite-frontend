"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { programUpdateSchema, ProgramUpdateSchema } from "../schema";
import { updateProgramAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { FormUpdateBaseProps } from "@/modules/common/components/global/form/types/form-props";
import EnterpriseSelect from "@/modules/enterprise/components/select-list";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { getRequiredFields } from "@/modules/common/lib/zod-required-field-checker";
import { Badge } from "@ui/badge";
import { X } from "lucide-react";

type UpdateFormProps = FormUpdateBaseProps<ProgramUpdateSchema>;

export default function UpdateForm({
  currentData,
  cancelRedirectPath,
  successRedirectPath,
}: UpdateFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(programUpdateSchema),
    defaultValues: currentData,
  });

  const { closeModal, setDefaultValues, redirect } = useFormState();

  const requiredFields = useMemo(
    () => getRequiredFields(programUpdateSchema),
    []
  );

  const handleSubmit = async (data: ProgramUpdateSchema) => {
    try {
      await updateProgramAction(data, currentData.id ?? "");
      toast.success("Program updated successfully");
      form.reset();
      closeModal();
      redirect(router, successRedirectPath);
    } catch (error) {
      toast.error("Failed to update program");
      console.error(error);
    }
  };

  const handleCancel = () => {
    form.reset();
    closeModal();
    redirect(router, cancelRedirectPath);
  };

  useEffect(() => {
    setDefaultValues(currentData);
  }, [currentData, setDefaultValues]);

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
      <div className="grid xl:grid-cols-3 grid-cols-2 gap-4">
        <div>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("name")}>
                  Name
                </FieldLabel>
                <Input
                  autoComplete="off"
                  placeholder="Course Name"
                  {...field}
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
            name="short_name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("short_name")}>
                  Short Name
                </FieldLabel>
                <Input
                  autoComplete="off"
                  placeholder="Short Name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    form.setValue(
                      "program_key",

                      // remove special characters except space and hyphen
                      e.target.value
                        .toLowerCase()
                        .replace(/ /g, "-")
                        .replace(/[^a-z0-9\s-]/g, "")
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
            name="program_key"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("program_key")}>
                  Program Key
                </FieldLabel>
                <Input
                  autoComplete="off"
                  placeholder="Program Key"
                  {...field}
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
                  Program Type
                </FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="capitalize w-full">
                    <SelectValue placeholder="Select Program Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ProgramType).map((type) => (
                      <SelectItem
                        className="capitalize w-full"
                        key={type}
                        value={type}
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
          <div>
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
        <div className="col-span-2 xl:col-span-3">
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
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </footer>
    </form>
  );
}
