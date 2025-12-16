"use client";
import { Field, FieldError, FieldGroup, FieldLabel } from "@ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TemplateFormInput,
  TemplateFormSchema,
} from "@microsite-cms/common/services/db/actions/template/schema";
import { Input } from "@ui/input";
import FormPage from "@microsite-cms/template/screens/components/form/form-page";
import { Button } from "@ui/button";
import { AlertCircle } from "lucide-react";
import FormSection from "@microsite-cms/template/screens/components/form/form-section";
import { toast } from "sonner";
import { createTemplate } from "@microsite-cms/common/services/db/actions/template/create";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import CohortSelectList from "@/modules/cohort/components/cohort-select-list";

export default function CreateForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cohort_key = searchParams.get("cohort_key");

  const form = useForm<TemplateFormInput>({
    resolver: zodResolver(TemplateFormSchema),
    defaultValues: {
      name: "",
      cohortId: cohort_key ?? "",
      pages: [],
    },
  });

  async function handleSubmit(fields: TemplateFormInput) {
    toast.promise(
      async () => {
        await createTemplate(fields);
        router.push("/templates");
      },
      {
        loading: "Saving...",
        success: "Template saved successfully",
        error: "Failed to save template",
      }
    );
  }

  return (
    <div>
      <form
        id="form-rhf-demo"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-10"
      >
        {Object.entries(form.formState.errors).length > 0 && (
          <div className="py-5 space-y-2">
            {Object.entries(form.formState.errors).map(([key, error]) => (
              <div key={key}>
                <h5 className="flex capitalize items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="size-4" /> {key}
                </h5>
                <FieldError errors={[error]} />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-5">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="cohortId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-name">Cohort</FieldLabel>
                  <CohortSelectList
                    onChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        <Tabs defaultValue="common" className="w-full space-y-3">
          <TabsList>
            <TabsTrigger value="common">Common</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
          </TabsList>
          <TabsContent value="common">
            <div className="bg-primary/5 p-8 space-y-5 rounded-lg">
              <FormSection
                form={form}
                fieldArrayName="globalSections"
                title="Global Sections"
              />
            </div>
          </TabsContent>
          <TabsContent value="pages">
            <div className="bg-primary/5 p-8 space-y-5 rounded-lg">
              <FormPage form={form} />
            </div>
          </TabsContent>
        </Tabs>
        <div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}
