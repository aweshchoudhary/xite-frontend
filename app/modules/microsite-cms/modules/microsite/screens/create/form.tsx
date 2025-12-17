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
import { ITemplate } from "@microsite-cms/common/services/db/types/interfaces";
import { createMicrosite } from "@microsite-cms/common/services/db/actions/microsite/create";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import CohortSelectList from "@/modules/cohort/components/cohort-select-list";
import { useEffect, useState } from "react";
import { getTemplatesByCohortIdAction } from "./action";

const formSchema = z.object({
  title: z.string().min(1, { message: "this field is required" }),
  cohortId: z.string().min(1, { message: "this field is required" }),
  templateId: z.string().min(1, { message: "this field is required" }),
});

export default function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cohort_key = searchParams.get("cohort_key");
  const [cohortId, setCohortId] = useState<string>(cohort_key ?? "");

  const [templates, setTemplates] = useState<ITemplate[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      cohortId: cohort_key ?? "",
      templateId: "",
    },
  });

  async function handleSubmit(fields: z.infer<typeof formSchema>) {
    toast.promise(
      async () => {
        const microsite = await createMicrosite(fields);
        router.push(`/microsites/${microsite._id}/edit`);
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
      const templates = await getTemplatesByCohortIdAction(cohortId);
      setTemplates(templates);
    };
    fetchTemplates();
  }, [cohortId]);

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
              name="cohortId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="cohortId">Cohort ID</FieldLabel>
                  <CohortSelectList
                    onChange={(value) => {
                      setCohortId(value);
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  />
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="templateId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="templateId">Template ID</FieldLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
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
                </Field>
              )}
            />
          </FieldGroup>
        </div>
        <div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}
