"use client";
import { Controller, Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { programUpdateSchema, ProgramUpdateSchema } from "../schema";
import { updateProgramAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import { Input } from "@/modules/common/components/ui/input";
import { Button } from "@/modules/common/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/common/components/ui/select";
import { ProgramType } from "@/modules/common/database";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import AcademicPartnerSelect from "../../academic-partner-list";
import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import { FormUpdateBaseProps } from "@/modules/common/components/global/form/types/form-props";
import EnterpriseSelect from "@/modules/enterprise/components/select-list";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/modules/common/components/ui/field";

interface UpdateFormProps extends FormUpdateBaseProps<ProgramUpdateSchema> {}

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid xl:grid-cols-3 grid-cols-2 gap-4">
          <div>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
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
                  <FieldLabel>Short Name</FieldLabel>
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
                  <FieldLabel>Program Key</FieldLabel>
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
                  <FieldLabel>Program Type</FieldLabel>
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
            <div>
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
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </footer>
      </form>
    </Form>
  );
}
