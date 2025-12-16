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
} from "@microsite-cms/common/services/db/actions/template/schema";
import { Input } from "@/modules/common/components/ui/input";
import FormPage from "@microsite-cms/template/screens/components/form/form-page";
import { Button } from "@/modules/common/components/ui/button";
import { AlertCircle } from "lucide-react";
import FormSection from "@microsite-cms/template/screens/components/form/form-section";
import { toast } from "sonner";
import { ITemplate } from "@microsite-cms/common/services/db/types/interfaces";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/common/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/common/components/ui/select";
import { updateTemplateAction } from "./action";
import { useRouter } from "next/navigation";
import CohortSelectList from "@/modules/cohort/components/cohort-select-list";

interface UpdateFormProps {
  template: ITemplate;
}

export default function UpdateForm({ template }: UpdateFormProps) {
  const form = useForm<TemplateFormInput>({
    resolver: zodResolver(TemplateFormSchema),
    defaultValues: template,
  });

  const router = useRouter();

  async function handleSubmit(fields: TemplateFormInput) {
    toast.promise(
      async () => {
        await updateTemplateAction(template._id!, fields);
        router.push(`/templates/${template._id}`);
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
        id="update"
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

        <div className="grid grid-cols-6 gap-4">
          <FieldGroup className="col-span-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="update-title"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup className="col-span-3">
            <Controller
              name="cohortId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-name">Cohort</FieldLabel>
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
          <FieldGroup>
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-status">Status</FieldLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
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
