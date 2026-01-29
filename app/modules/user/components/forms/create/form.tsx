"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchema, CreateSchema } from "../schema";
import { createAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";

import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { MODULE_NAME } from "@/modules/user/contants";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { useRouter } from "next/navigation";
import { Label } from "@ui/label";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { useEffect, useState, useMemo } from "react";
import { getRequiredFields } from "@/modules/common/lib/zod-required-field-checker";
import { getAllRoles } from "../read/action";
import { Checkbox } from "@ui/checkbox";
import { Switch } from "@ui/switch";

type CreateFormProps = FormBaseProps<CreateSchema>;

export default function CreateForm({
  cancelRedirectPath,
  successRedirectPath,
  defaultValues,
}: CreateFormProps) {
  const form = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      roles: [],
      isActive: true,
      ...defaultValues,
    },
  });

  const [roles, setRoles] = useState<{ id: string; role: string }[]>([]);

  const { closeModal, redirect } = useFormState();
  const router = useRouter();

  const requiredFields = useMemo(() => getRequiredFields(createSchema), []);

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

  useEffect(() => {
    const fetchRoles = async () => {
      const result = await getAllRoles();
      if (result.data) {
        setRoles(result.data);
      }
    };
    fetchRoles();
  }, []);

  const selectedRoles = form.watch("roles");

  return (
    <form
      autoComplete="off"
      className="space-y-6"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field>
          <FieldLabel isRequired={requiredFields.includes("name")}>
            Name
          </FieldLabel>
          <Input {...form.register("name")} placeholder="Enter name" />
          <FieldError>{form.formState.errors.name?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel isRequired={requiredFields.includes("email")}>
            Email
          </FieldLabel>
          <Input
            {...form.register("email")}
            type="email"
            placeholder="Enter email"
          />
          <FieldError>{form.formState.errors.email?.message}</FieldError>
        </Field>
      </div>

      <Field>
        <FieldLabel isRequired={requiredFields.includes("username")}>
          Username
        </FieldLabel>
        <Input {...form.register("username")} placeholder="Enter username" />
        <FieldError>{form.formState.errors.username?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel isRequired={requiredFields.includes("roles")}>
          Roles
        </FieldLabel>
        <div className="space-y-2">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center space-x-2">
              <Checkbox
                id={`role-${role.id}`}
                checked={selectedRoles.includes(role.role)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    form.setValue("roles", [...selectedRoles, role.role]);
                  } else {
                    form.setValue(
                      "roles",
                      selectedRoles.filter((r) => r !== role.role)
                    );
                  }
                }}
              />
              <Label htmlFor={`role-${role.id}`} className="cursor-pointer">
                {role.role}
              </Label>
            </div>
          ))}
        </div>
        <FieldError>{form.formState.errors.roles?.message}</FieldError>
      </Field>

      <Field>
        <div className="flex items-center justify-between">
          <FieldLabel>Active Status</FieldLabel>
          <Switch
            checked={form.watch("isActive")}
            onCheckedChange={(checked) => form.setValue("isActive", checked)}
          />
        </div>
      </Field>

      <div className="flex flex-row items-center gap-2">
        <Button
          type="button"
          onClick={handleCancel}
          disabled={form.formState.isSubmitting}
          variant="outline"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : `Create ${MODULE_NAME}`}
        </Button>
      </div>
    </form>
  );
}
