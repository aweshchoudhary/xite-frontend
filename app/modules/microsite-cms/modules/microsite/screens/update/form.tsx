"use client";
import {
  IMicrosite,
  ITemplate,
} from "@/modules/common/services/db/types/interfaces";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MicrositeFormInput,
  MicrositeSchema,
} from "@/modules/common/services/db/actions/microsite/schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/modules/common/components/ui/field";
import { Input } from "@/modules/common/components/ui/input";
import { Button } from "@/modules/common/components/ui/button";
import { AlertCircle } from "lucide-react";
import FormPage from "./components/form-page";
import FormSection from "./components/form-section";
import { toast } from "sonner";
import { updateMicrosite } from "@/modules/common/services/db/actions/microsite/update";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/common/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/common/components/ui/tabs";

export interface UpdateFormProps {
  microsite: IMicrosite;
  template: ITemplate;
}

export default function UpdateForm({ microsite, template }: UpdateFormProps) {
  const form = useForm<MicrositeFormInput>({
    resolver: zodResolver(MicrositeSchema),
    defaultValues: {
      ...microsite,
      micrositeId: microsite._id || "",
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
      },
      {
        loading: "Saving...",
        success: "Microsite saved successfully",
        error: "Failed to save microsite",
      }
    );
  }

  return (
    <div>
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
      <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>

      <form
        id="form-rhf-demo"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-10"
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
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
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
        </Tabs>
        <div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}
