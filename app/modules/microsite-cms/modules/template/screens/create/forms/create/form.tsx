"use client";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/modules/common/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TemplateFormInput,
  TemplateFormSchema,
} from "@/modules/common/services/db/actions/template/schema";
import { Input } from "@/modules/common/components/ui/input";
import FormPage from "@/modules/template/screens/components/form/form-page";
import { Button } from "@/modules/common/components/ui/button";
import { AlertCircle } from "lucide-react";
import FormSection from "@/modules/template/screens/components/form/form-section";
import { toast } from "sonner";
import { createTemplate } from "@/modules/common/services/db/actions/template/create";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/common/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function CreateForm() {
  const router = useRouter();
  const form = useForm<TemplateFormInput>({
    resolver: zodResolver(TemplateFormSchema),
    defaultValues: {
      name: "",
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
