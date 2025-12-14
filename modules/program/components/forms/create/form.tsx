"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { programCreateSchema, ProgramCreateSchema } from "../schema";
import { createProgramAction } from "./action";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/common/components/ui/select";
import { ProgramType } from "@/modules/common/database/prisma/generated/prisma/client";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import AcademicPartnerSelect from "../../academic-partner-list";
import EnterpriseSelect from "@/modules/enterprise/components/select-list";
import { useEffect } from "react";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { useRouter } from "next/navigation";

interface CreateFormProps extends FormBaseProps<ProgramCreateSchema> {}

export default function CreateForm({
  cancelRedirectPath,
  successRedirectPath,
  defaultValues,
}: CreateFormProps) {
  const form = useForm({
    resolver: zodResolver(programCreateSchema),
    defaultValues: {
      ...defaultValues,
      description: defaultValues?.description,
      type: defaultValues?.type ?? ProgramType.OPEN,
    },
  });

  const { closeModal, redirect } = useFormState();
  const router = useRouter();

  const handleSubmit = async (data: ProgramCreateSchema) => {
    toast.promise(submitHandler(data), {
      loading: "Creating program...",
      success: "Program created successfully",
      error: "Failed to create program",
    });
  };

  const submitHandler = async (data: ProgramCreateSchema) => {
    await createProgramAction(data);
    redirect(router, successRedirectPath);
    closeModal();
  };

  const handleCancel = () => {
    redirect(router, cancelRedirectPath);
    closeModal();
  };

  useEffect(() => {
    if (form.getValues("type") === ProgramType.CUSTOM) {
      form.setValue("enterprise_id", "");
    } else {
      form.setValue("enterprise_id", undefined);
    }
  }, [form.getValues("type")]);

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
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
          <div>
            <FormField
              control={form.control}
              name="short_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Short Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Oxford SELP, MR Ross"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue(
                          "program_key",
                          e.target.value.toLowerCase().replace(/ /g, "-")
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full capitalize">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {Object.values(ProgramType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {enumDisplay(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="academic_partner_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Partner</FormLabel>
                  <FormControl>
                    <AcademicPartnerSelect formField={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.watch("type") === ProgramType.CUSTOM && (
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="enterprise_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enterprise</FormLabel>
                    <FormControl>
                      <EnterpriseSelect formField={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
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
