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
import { Button } from "@/modules/common/components/ui/button";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import { DatePickerField } from "@/modules/common/components/global/form/date-form-field";
import DraggableList from "./sort-sections";

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
    toast.promise(updateAction({ data }), {
      loading: "Updating microsite section...",
      success: "Microsite section updated",
      error: "Error updating microsite section",
    });
    onSuccess?.();
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
        className="space-y-5"
      >
        <div className="grid xl:grid-cols-2 gap-6">
          <div>
            <FormLabel className="mb-3">Visibility</FormLabel>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="visibility_start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DatePickerField formField={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>:</div>

              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="visibility_end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DatePickerField formField={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div>
            <FormLabel className="mb-3">Custom Domain</FormLabel>
            <FormField
              control={form.control}
              name="custom_domain"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <DraggableList
            items={
              defaultValues?.sections?.sort(
                (a, b) => a.section_position - b.section_position
              ) || []
            }
            onReorder={(data: any) => {
              form.setValue("sections", data);
            }}
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
