"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "./schema";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
  FormLabel,
} from "@/modules/common/components/ui/form";
import { Input } from "@/modules/common/components/ui/input";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import { Button } from "@/modules/common/components/ui/button";
import { Label } from "@/modules/common/components/ui/label";

interface CreateFormProps extends FormBaseProps<UpdateSchema> {}

export default function CreateForm({
  defaultValues,
  onSuccess,
  onCancel,
}: CreateFormProps) {
  const form = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: defaultValues as UpdateSchema,
  });

  const handleSubmit = async (data: UpdateSchema) => {
    try {
      await updateAction({ data });
      toast.success(`Faculty section updated`);
      onSuccess?.();
    } catch (error) {
      toast.error("Error updating Faculty section");
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <div>
      <Label className="mb-3">Section Title</Label>
      <Form {...form}>
        <form
          autoComplete="off"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex items-center gap-2"
        >
          <div>
            <h3 className="text-2xl font-semibold text-foreground">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Section Title"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </h3>
          </div>

          <footer className="flex justify-end gap-2">
            <Button type="submit" size="sm">
              {form.formState.isSubmitting ? (
                "Saving.."
              ) : (
                "Save"
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </footer>
        </form>
      </Form>
    </div>
  );
}
