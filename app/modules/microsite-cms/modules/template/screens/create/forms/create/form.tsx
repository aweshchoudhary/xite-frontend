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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import CohortSelectList from "@/modules/cohort/components/cohort-select-list";
import { useState } from "react";
import TemplateSelectList from "@microsite-cms/template/components/template-select-list";

export default function CreateForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cohort_key = searchParams.get("cohort_key");
  const [creationMode, setCreationMode] = useState<"copy" | "scratch" | null>(
    null
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const form = useForm<TemplateFormInput>({
    resolver: zodResolver(TemplateFormSchema),
    defaultValues: {
      name: "",
      cohortId: cohort_key ?? "",
      type: "open",
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

  async function handleCopyFromTemplate() {
    if (!selectedTemplateId) {
      toast.error("Please select a template");
      return;
    }
    router.push(`/templates/${selectedTemplateId}`);
  }

  // Show initial selection if no mode is selected
  if (creationMode === null) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Create Template</h2>
        <p className="text-muted-foreground">
          Choose how you want to create your template
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-2"
            onClick={() => setCreationMode("copy")}
          >
            <span className="text-lg font-medium">
              Copy from other template
            </span>
            <span className="text-sm text-muted-foreground">
              Start with an existing template
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-2"
            onClick={() => setCreationMode("scratch")}
          >
            <span className="text-lg font-medium">Start from scratch</span>
            <span className="text-sm text-muted-foreground">
              Create a new template from scratch
            </span>
          </Button>
        </div>
      </div>
    );
  }

  // Show copy from template form
  if (creationMode === "copy") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCreationMode(null)}
          >
            ← Back
          </Button>
          <h2 className="text-xl font-semibold">Copy from Template</h2>
        </div>
        <div className="max-w-md space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="template-select">Select Template</FieldLabel>
              <TemplateSelectList
                onChange={setSelectedTemplateId}
                defaultValue={selectedTemplateId}
              />
            </Field>
          </FieldGroup>
          <div>
            <Button
              type="button"
              onClick={handleCopyFromTemplate}
              disabled={!selectedTemplateId}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show create from scratch form
  return (
    <div>
      <div className="mb-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCreationMode(null)}
        >
          ← Back
        </Button>
      </div>
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

        <div className="grid grid-cols-3 gap-5">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="title"
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
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-template-type">
                    Template Type
                  </FieldLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="create-template-type">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open template</SelectItem>
                      <SelectItem value="fixed">Fixed template</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          {form.watch("type") === "open" && (
            <FieldGroup>
              <Controller
                name="cohortId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Cohort</FieldLabel>
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
          )}
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
