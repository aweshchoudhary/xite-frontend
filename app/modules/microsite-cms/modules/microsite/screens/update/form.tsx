"use client";
import {
  IMicrosite,
  ITemplate,
} from "@microsite-cms/common/services/db/types/interfaces";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MicrositeFormInput,
  MicrositeSchema,
} from "@microsite-cms/common/services/db/actions/microsite/schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { AlertCircle } from "lucide-react";
import FormPage from "./components/form-page";
import FormSection from "./components/form-section";
import FormBranding from "./components/form-branding";
import { toast } from "sonner";
import { updateMicrosite } from "@microsite-cms/common/services/db/actions/microsite/update";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { useRouter } from "next/navigation";
export interface UpdateFormProps {
  microsite: IMicrosite;
  template: ITemplate;
  onSaveSuccess?: () => void;
}

export default function UpdateForm({
  microsite,
  template,
  onSaveSuccess,
}: UpdateFormProps) {
  const router = useRouter();
  const form = useForm<MicrositeFormInput>({
    resolver: zodResolver(MicrositeSchema),
    defaultValues: {
      ...microsite,
      micrositeId: microsite._id || "",
      branding: microsite.branding || {
        logo: undefined,
        favicon: undefined,
        colors: {
          primary: undefined,
          primary_foreground: undefined,
          secondary: undefined,
          secondary_foreground: undefined,
          accent: undefined,
          accent_foreground: undefined,
          border: undefined,
        },
        fonts: {
          family: undefined,
        },
      },
    },
  });

  async function handleSubmit(fields: MicrositeFormInput) {
    toast.promise(
      async () => {
        if (!microsite._id) {
          return toast.error("Microsite ID is required");
        }

        if (microsite.status === "active") {
          // Validate all the required elements in the microsite
          fields.globalSections.forEach((section, sectionIndex) => {
            const templateSection = template.globalSections.find(
              (s) => s.key === section.key
            );
            section.blocks.forEach((block, blockIndex) => {
              const templateBlock = templateSection?.blocks.find(
                (b) => b.key === block.key
              );

              if (templateBlock) {
                templateBlock.elements.forEach((element) => {
                  if (element.required) {
                    // For single blocks, value is directly at block.value[element.key]
                    // For group blocks, value is at block.value[element.key]
                    const value = block.value?.[element.key];
                    if (
                      !value ||
                      (typeof value === "string" && value.trim() === "")
                    ) {
                      form.setError(
                        `globalSections.${sectionIndex}.blocks.${blockIndex}.value.${element.key}`,
                        {
                          message: `Required element ${element.key} is missing`,
                        }
                      );
                    }
                  }
                });
              }
            });
          });

          fields.pages.forEach((page, pageIndex) => {
            const templatePage = template.pages.find(
              (p) => p.slug === page.meta.slug
            );
            page.sections.forEach((section, sectionIndex) => {
              const templateSection = templatePage?.sections.find(
                (s) => s.key === section.key
              );
              section.blocks.forEach((block, blockIndex) => {
                const templateBlock = templateSection?.blocks.find(
                  (b) => b.key === block.key
                );
                if (templateBlock) {
                  templateBlock.elements.forEach((element) => {
                    if (element.required) {
                      // For single blocks, value is directly at block.value[element.key]
                      // For group blocks, value is at block.value[element.key]
                      const value = block.value?.[element.key];
                      if (
                        !value ||
                        (typeof value === "string" && value.trim() === "")
                      ) {
                        form.setError(
                          `pages.${pageIndex}.sections.${sectionIndex}.blocks.${blockIndex}.value.${element.key}`,
                          {
                            message: `Required element ${element.key} is missing`,
                          }
                        );
                      }
                    }
                  });
                }
              });
            });
          });
        }

        console.log(fields);

        await updateMicrosite({
          micrositeId: microsite._id,
          templateId: microsite.templateId,
          fields,
        });
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      },
      {
        loading: "Saving...",
        success: "Microsite saved successfully",
        error: "Failed to save microsite",
      }
    );
  }

  function handleCancel() {
    const redirect_path = microsite.cohortId
      ? `/cohorts/${microsite.cohortId}?tab=microsite-cms`
      : `/cms?tab=microsite-cms`;
    router.push(redirect_path);
  }

  return (
    <div className="space-y-6">
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

      <form
        id="form-rhf-demo"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-10"
        aria-label="Edit microsite form"
      >
        <div className="grid grid-cols-2 gap-5">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">Title</FieldLabel>
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
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status" aria-label="Select status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        <Tabs defaultValue="global" className="w-full space-y-3">
          <TabsList>
            <TabsTrigger value="global">Global Sections</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>
          <TabsContent value="global">
            <div className="bg-primary/5 p-8 space-y-5 rounded-lg">
              <FormSection
                form={form}
                fieldArrayName="globalSections"
                title="Global Sections"
                templateSection={template.globalSections}
              />
            </div>
          </TabsContent>
          <TabsContent value="pages">
            <div className="bg-primary/5 p-8 space-y-5 rounded-lg">
              <FormPage form={form} template={template} />
            </div>
          </TabsContent>
          <TabsContent value="branding">
            <div className="bg-primary/5 p-8 space-y-5 rounded-lg">
              <FormBranding form={form} />
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
