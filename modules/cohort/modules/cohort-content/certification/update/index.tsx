"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "./schema";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/modules/common/components/ui/form";
import { Input } from "@/modules/common/components/ui/input";
import { Button, buttonVariants } from "@/modules/common/components/ui/button";
import { MODULE_NAME } from "@/modules/academic-partner/contants";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import Image from "next/image";
import ImageSelector from "@/modules/common/components/global/image-selector";
import { generatePreviewUrl } from "@/modules/common/lib/img-preview-url-generator";
import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn, getImageUrl } from "@/modules/common/lib/utils";
import MicrositeAdditionalFields from "../../common/components/microsite-additional-fields-update";

interface CreateFormProps extends FormBaseProps<UpdateSchema> {}

export default function CreateForm({
  defaultValues,
  onSuccess,
  onCancel,
}: CreateFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: defaultValues as UpdateSchema,
  });

  const handleSubmit = async (data: UpdateSchema) => {
    try {
      await updateAction({ data });
      toast.success(`${MODULE_NAME} updated`);
      onSuccess?.();
    } catch (error) {
      toast.error("Error updating certification section");
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <div className="space-y-5">
          <h3 className="h3 font-semibold">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </h3>
          <div className="lg:w-1/2 mx-auto">
            <div className="col-span-2 cursor-pointer!">
              <FormField
                control={form.control}
                name="certificate_image_file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormLabel htmlFor="image-selector">
                        <ImageSelector
                          setSelectedImage={(image) => {
                            setSelectedImage(image);
                            field.onChange(image);
                          }}
                        />
                        {field.value ||
                        form.getValues("certificate_image_url") ? (
                          <div className="w-full h-auto relative">
                            <Image
                              src={
                                field.value
                                  ? generatePreviewUrl(field.value) ?? ""
                                  : getImageUrl(
                                      form.getValues("certificate_image_url") ??
                                        ""
                                    )
                              }
                              alt="Certificate Image"
                              width={500}
                              height={500}
                              className="w-full h-auto object-contain"
                            />
                            <div
                              className={cn(
                                buttonVariants({ variant: "default" }),
                                "absolute bottom-2 right-2 z-40 cursor-pointer"
                              )}
                            >
                              Change
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-video rounded-lg w-full bg-accent flex flex-col items-center justify-center">
                            <ImageIcon className="size-14 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              {" "}
                              Select Image
                            </p>
                          </div>
                        )}
                      </FormLabel>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <MicrositeAdditionalFields
            form={form}
            top_desc_field_name="top_description"
            bottom_desc_field_name="bottom_description"
          />
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
    </Form>
  );
}
