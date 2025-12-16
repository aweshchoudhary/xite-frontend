"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchema, CreateSchema } from "../schema";
import { createAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { Button } from "@ui/button";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { useRouter } from "next/navigation";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { Controller, useForm } from "react-hook-form";
import { Badge } from "@ui/badge";
import { X } from "lucide-react";

type CreateFormProps = FormBaseProps<CreateSchema>;

export default function CreateForm({
  cancelRedirectPath,
  successRedirectPath,
  defaultValues,
}: CreateFormProps) {
  const form = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: defaultValues as CreateSchema,
  });

  const { closeModal, redirect } = useFormState();
  const router = useRouter();

  const handleSubmit = async (data: CreateSchema) => {
    const resp = await createAction(data);

    if (resp.data) {
      toast.success("SubTopic created");
      redirect(router, successRedirectPath);
      closeModal();
    }

    if (resp.error) {
      toast.error(resp.error);
    }
  };

  const handleCancel = () => {
    redirect(router, cancelRedirectPath);
    closeModal();
  };

  const keywords = form.watch("keywords") || [];

  const addKeyword = () => {
    const input = document.getElementById("keyword-input") as HTMLInputElement;
    const value = input?.value?.trim();
    if (value && !keywords.includes(value)) {
      form.setValue("keywords", [...keywords, value]);
      input.value = "";
    }
  };

  const removeKeyword = (keyword: string) => {
    form.setValue(
      "keywords",
      keywords.filter((k) => k !== keyword)
    );
  };

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-8"
    >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <Input placeholder="Title" {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="col-span-2">
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    value={field.value ?? ""}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="col-span-2">
            <Controller
              control={form.control}
              name="taost_id"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Taost ID</FieldLabel>
                  <Input placeholder="Taost ID" {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="col-span-2">
            <Field>
              <FieldLabel>Keywords</FieldLabel>
              <div className="flex gap-2">
                <Input
                  id="keyword-input"
                  placeholder="Add keyword"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                />
                <Button type="button" onClick={addKeyword}>
                  Add
                </Button>
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="gap-1">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </Field>
          </div>
        </div>

        <footer className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {form.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </footer>
    </form>
  );
}

