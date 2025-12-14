"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "../schema";
import { updateAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/modules/common/components/ui/form";
import { Input } from "@/modules/common/components/ui/input";
import { Button } from "@/modules/common/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MODULE_NAME } from "@/modules/enterprise/contants";
import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import { FormUpdateBaseProps } from "@/modules/common/components/global/form/types/form-props";

interface UpdateFormProps extends FormUpdateBaseProps<UpdateSchema> {}

export default function UpdateForm({
  currentData,
  cancelRedirectPath,
  successRedirectPath,
}: UpdateFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: currentData,
  });

  const { closeModal, setDefaultValues, redirect } = useFormState();

  const handleSubmit = async (data: UpdateSchema) => {
    const resp = await updateAction(data, currentData.id ?? "");
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
    setDefaultValues({
      name: currentData.name,
      description: currentData.description ?? undefined,
    });
  }, [currentData, setDefaultValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <TextEditor placeholder="Address" formField={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <TextEditor placeholder="Note" formField={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
    </Form>
  );
}
