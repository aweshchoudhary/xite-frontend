"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Field, FieldError, FieldLabel, FieldGroup } from "@ui/field";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@ui/select";
import {
  ITemplate,
  TemplateType,
} from "@microsite-cms/common/services/db/types/interfaces";
import { createMicrosite } from "@microsite-cms/common/services/db/actions/microsite/create";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getTemplateListAction } from "../../../template/components/template-select-list/action";

const formSchema = z.object({
  title: z.string().min(1, { message: "this field is required" }),
  cohortId: z.string(),
  templateId: z.string().min(1, { message: "this field is required" }),
  type: z.enum(["generic", "program-specific"]).optional(),
});

interface CreateFormProps {
  cohort_key?: string;
  type?: TemplateType;
}

export default function CreateForm({
  cohort_key: cohortKeyProp,
  type: defaultType,
}: CreateFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cohort_key = cohortKeyProp ?? searchParams.get("cohort_key") ?? "";
  const type_key = searchParams.get("type");

  const [cohortId] = useState<string>(cohort_key);

  const [templates, setTemplates] = useState<ITemplate[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      cohortId: cohort_key,
      templateId: "",
      type: defaultType || (type_key as TemplateType) || "generic",
    },
  });

  async function handleSubmit(fields: z.infer<typeof formSchema>) {
    toast.promise(
      async () => {
        await createMicrosite({
          ...fields,
          type: fields.type ?? "generic",
        });
        const redirect_path = cohortKeyProp
          ? `/cohorts/${cohortId}?tab=microsite-cms`
          : `/cms?tab=microsites`;
        router.push(redirect_path);
      },
      {
        loading: "Saving...",
        success: "Microsite saved successfully",
        error: "Failed to save microsite",
      }
    );
  }

  useEffect(() => {
    const fetchTemplates = async () => {
      // Always fetch templates - getTemplatesByCohortId returns fixed templates even when cohortId is undefined
      const allTemplates = await getTemplateListAction(
        defaultType || (type_key as TemplateType) || "generic"
      );
      setTemplates(allTemplates);
    };
    fetchTemplates();
  }, [defaultType, type_key]);

  const templateId = form.watch("templateId");
  const showOtherFields = !!templateId;

  function handleCancel() {
    const redirect_path = cohortKeyProp
      ? `/cohorts/${cohortId}?tab=microsite-cms`
      : `/cms?tab=microsites`;
    router.push(redirect_path);
  }

  return (
    <div className="space-y-6">
      <form
        id="form-rhf-demo"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-10"
        aria-label="Create microsite form"
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

        <div className="space-y-5">
          <FieldGroup>
            <Controller
              name="templateId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center gap-2">
                    <FieldLabel htmlFor="templateId" className="flex-1">
                      Template
                    </FieldLabel>
                  </div>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="templateId" aria-label="Select template">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem
                          key={template._id ?? ""}
                          value={template._id ?? ""}
                        >
                          {template.name}
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
          </FieldGroup>

          {showOtherFields && (
            <>
              <input
                type="hidden"
                {...form.register("cohortId")}
                value={cohort_key}
              />
              <FieldGroup>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        Title
                      </FieldLabel>
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
            </>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}
