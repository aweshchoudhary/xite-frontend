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
import { duplicateTemplateAction } from "@microsite-cms/template/screens/list/actions/duplicate";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";

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

    toast.promise(
      async () => {
        const duplicatedTemplate = await duplicateTemplateAction(
          selectedTemplateId,
          cohort_key ?? undefined
        );
        if (duplicatedTemplate._id) {
          router.push(`/templates/${duplicatedTemplate._id}`);
        } else {
          throw new Error("Failed to create template copy");
        }
      },
      {
        loading: "Creating template copy...",
        success: "Template copied successfully",
        error: "Failed to copy template",
      }
    );
  }

  function handleCancel() {
    router.push("/templates");
  }

  // Show initial selection if no mode is selected
  if (creationMode === null) {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/templates">Templates</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Template</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold">Create Template</h1>
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
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Show copy from template form
  if (creationMode === "copy") {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/templates">Templates</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCreationMode(null);
                }}
              >
                Create Template
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Copy from Template</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCreationMode(null)}
          >
            ← Back
          </Button>
          <h1 className="text-2xl font-semibold">Copy from Template</h1>
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
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCopyFromTemplate}
              disabled={!selectedTemplateId}
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show create from scratch form
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/templates">Templates</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCreationMode(null);
              }}
            >
              Create Template
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create from Scratch</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCreationMode(null)}
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-semibold">Create Template from Scratch</h1>
      </div>
      <form
        id="form-rhf-demo"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-10"
        aria-label="Create template form"
      >
        {Object.entries(form.formState.errors).length > 0 && (
          <div className="py-5 space-y-2" role="alert" aria-live="polite">
            {Object.entries(form.formState.errors).map(([key, error]) => (
              <div key={key}>
                <h5 className="flex capitalize items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="size-4" aria-hidden="true" /> {key}
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
                    id="name"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid ? "name-error" : undefined
                    }
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
            <div>
              <FormPage form={form} />
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}
