"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "../schema";
import { updateAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import { Input } from "@ui/input";
import { Button, buttonVariants } from "@ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MODULE_NAME } from "@/modules/academic-partner/contants";
import { Textarea } from "@ui/textarea";
import { Label } from "@ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { cn, getImageUrl } from "@/modules/common/lib/utils";
import { FormUpdateBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { generatePreviewUrl } from "@/modules/common/lib/img-preview-url-generator";
import ImageSelector from "@/modules/common/components/global/image-selector";
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui/field";

interface UpdateFormProps extends FormUpdateBaseProps<UpdateSchema> {}

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
      toast.success(`${MODULE_NAME} updated`);
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
              name="logo_file"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Logo</FieldLabel>
                  <Label htmlFor="image-selector">
                    <ImageSelector
                      setSelectedImage={(image) => {
                        field.onChange(image);
                        form.setValue("logo_file_action", "upload");
                      }}
                    />
                    <Avatar className="size-24 border">
                      <AvatarImage
                        src={
                          field.value
                            ? generatePreviewUrl(field.value) ?? ""
                            : getImageUrl(currentData.logo_url ?? "")
                        }
                      />
                      <AvatarFallback className="uppercase">
                        {form.watch("name")
                          ? form.watch("name")?.slice(0, 2)
                          : ""}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "mt-2 text-xs"
                      )}
                    >
                      {currentData.logo_url ? "Change" : "Upload"}
                    </div>
                  </Label>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input autoComplete="off" placeholder="Name" {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div>
            <Controller
              control={form.control}
              name="display_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Display Name</FieldLabel>
                  <Input
                    autoComplete="off"
                    placeholder="Display Name"
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
          {/* <div className="col-span-2">
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <TextEditor placeholder="Description" formField={field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div> */}
          <div className="col-span-2">
            <Controller
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Address</FieldLabel>
                  <Textarea
                    placeholder="Address"
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
