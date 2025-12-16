"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchema, CreateSchema } from "../schema";
import { createAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { Button, buttonVariants } from "@ui/button";
import { MODULE_NAME } from "@/modules/academic-partner/contants";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { useRouter } from "next/navigation";
import ImageSelector from "@/modules/common/components/global/image-selector";
import { Label } from "@ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { generatePreviewUrl } from "@/modules/common/lib/img-preview-url-generator";
import { cn } from "@/modules/common/lib/utils";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { Controller, useForm } from "react-hook-form";

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
      toast.success(`${MODULE_NAME} created`);
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
                      }}
                    />
                    <Avatar className="size-20 border">
                      {form.getValues("logo_file") && (
                        <AvatarImage
                          src={
                            generatePreviewUrl(form.getValues("logo_file")!) ??
                            ""
                          }
                        />
                      )}
                      <AvatarFallback className="uppercase">
                        {form.getValues("name")
                          ? form.getValues("name")?.slice(0, 2)
                          : ""}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "mt-2 text-xs"
                      )}
                    >
                      Upload
                    </div>
                  </Label>
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
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input placeholder="Name" {...field} />
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
              name="display_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Display Name</FieldLabel>
                  <Input
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
                  <TextEditor formField={field} placeholder="Description" />
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
            {form.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </footer>
    </form>
  );
}
