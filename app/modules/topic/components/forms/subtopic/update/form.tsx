"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "../schema";
import { updateAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@ui/textarea";
import { FormUpdateBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { Badge } from "@ui/badge";
import { X } from "lucide-react";

type UpdateFormProps = FormUpdateBaseProps<UpdateSchema>;

export default function UpdateForm({
  currentData,
  cancelRedirectPath,
  successRedirectPath,
}: UpdateFormProps) {
  const form = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: currentData,
  });

  const { closeModal, setDefaultValues, redirect } = useFormState();
  const router = useRouter();

  const handleSubmit = async (data: UpdateSchema) => {
    const resp = await updateAction(data, currentData.id);
    if (resp.data) {
      toast.success("SubTopic updated");
      redirect(router, successRedirectPath);
      closeModal();
    }
    if (resp.error) {
      toast.error(resp.error);
    }
  };

  const handleCancel = () => {
    form.reset();
    closeModal();
    redirect(router, cancelRedirectPath);
  };

  useEffect(() => {
    setDefaultValues(currentData);
  }, [currentData, setDefaultValues]);

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
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Title</FieldLabel>
                <Input autoComplete="off" placeholder="Title" {...field} />
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
                <Input autoComplete="off" placeholder="Taost ID" {...field} />
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
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </footer>
    </form>
  );
}
