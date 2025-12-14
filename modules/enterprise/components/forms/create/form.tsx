"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchema, CreateSchema } from "../schema";
import { createAction } from "./action";
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
import { MODULE_NAME } from "@/modules/enterprise/contants";
import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { useRouter } from "next/navigation";

interface CreateFormProps extends FormBaseProps<CreateSchema> {}

export default function CreateForm({
  cancelRedirectPath,
  successRedirectPath,
  defaultValues,
}: CreateFormProps) {
  const form = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: {
      ...defaultValues,
      description: defaultValues?.description,
    },
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
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
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
                    <TextEditor formField={field} placeholder="Address" />
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
                    <TextEditor formField={field} placeholder="Note" />
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
            {form.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </footer>
      </form>
    </Form>
  );
}
