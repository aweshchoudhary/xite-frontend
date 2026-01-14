"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { programUpdateSchema, ProgramUpdateSchema } from "../schema";
import { updateProgramAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import {
  PaymentMethod,
  ProgramType,
} from "@/modules/common/database/prisma/generated/prisma";
import { enumDisplay } from "@/modules/common/lib/enum-display";
import AcademicPartnerSelect from "../../academic-partner-list";
import { FormUpdateBaseProps } from "@/modules/common/components/global/form/types/form-props";
import EnterpriseSelect from "@/modules/enterprise/components/select-list";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { getRequiredFields } from "@/modules/common/lib/zod-required-field-checker";
import { Badge } from "@ui/badge";
import { X, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Checkbox } from "@ui/checkbox";
import { getProgramTagsAction } from "./get-program-tags-action";

type UpdateFormProps = FormUpdateBaseProps<ProgramUpdateSchema>;

export default function UpdateForm({
  currentData,
  cancelRedirectPath,
  successRedirectPath,
}: UpdateFormProps) {
  const router = useRouter();

  // Transform currentData tags from ProgramTag objects to tag IDs
  const transformedCurrentData = useMemo(() => {
    return {
      ...currentData,
      tags:
        currentData.tags
          ?.map((tag: { id?: string; name?: string } | string) =>
            typeof tag === "string" ? tag : tag.id || ""
          )
          .filter((id): id is string => Boolean(id)) || [],
    };
  }, [currentData]);

  const form = useForm({
    resolver: zodResolver(programUpdateSchema),
    defaultValues: transformedCurrentData,
  });

  const { closeModal, setDefaultValues, redirect } = useFormState();

  const requiredFields = useMemo(
    () => getRequiredFields(programUpdateSchema),
    []
  );

  const [programTags, setProgramTags] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [tagsPopoverOpen, setTagsPopoverOpen] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getProgramTagsAction();
      setProgramTags(tags);
    };
    fetchTags();
  }, []);

  const handleSubmit = async (data: ProgramUpdateSchema) => {
    try {
      await updateProgramAction(data, currentData.id ?? "");
      toast.success("Program updated successfully");
      form.reset();
      closeModal();
      redirect(router, successRedirectPath);
    } catch (error) {
      toast.error("Failed to update program");
      console.error(error);
    }
  };

  const handleCancel = () => {
    form.reset();
    closeModal();
    redirect(router, cancelRedirectPath);
  };

  useEffect(() => {
    setDefaultValues(transformedCurrentData);
  }, [transformedCurrentData, setDefaultValues]);

  const toggleTag = (
    tagId: string,
    currentTags: string[],
    onChange: (value: string[]) => void
  ) => {
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((id: string) => id !== tagId)
      : [...currentTags, tagId];
    onChange(newTags);
  };

  const removeTag = (
    tagId: string,
    currentTags: string[],
    onChange: (value: string[]) => void
  ) => {
    onChange(currentTags.filter((id: string) => id !== tagId));
  };

  const getTagName = (tagId: string) => {
    return programTags.find((tag) => tag.id === tagId)?.name || tagId;
  };

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-8"
    >
      <div className="grid xl:grid-cols-3 grid-cols-2 gap-4">
        <div>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("name")}>
                  Name
                </FieldLabel>
                <Input
                  autoComplete="off"
                  placeholder="Course Name"
                  {...field}
                />
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
            name="short_name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("short_name")}>
                  Short Name
                </FieldLabel>
                <Input
                  autoComplete="off"
                  placeholder="Short Name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    form.setValue(
                      "program_key",

                      // remove special characters except space and hyphen
                      e.target.value
                        .toLowerCase()
                        .replace(/ /g, "-")
                        .replace(/[^a-z0-9\s-]/g, "")
                    );
                  }}
                />
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
            name="program_key"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("program_key")}>
                  Program Key
                </FieldLabel>
                <Input
                  autoComplete="off"
                  placeholder="Program Key"
                  {...field}
                />
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
            name="type"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("type")}>
                  Program Type
                </FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="capitalize w-full">
                    <SelectValue placeholder="Select Program Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ProgramType).map((type) => (
                      <SelectItem
                        className="capitalize w-full"
                        key={type}
                        value={type}
                      >
                        {enumDisplay(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            name="academic_partner_id"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  isRequired={requiredFields.includes("academic_partner_id")}
                >
                  Academic Partner
                </FieldLabel>
                <AcademicPartnerSelect formField={field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        {form.getValues("type") === ProgramType.CUSTOM && (
          <div>
            <Controller
              control={form.control}
              name="enterprise_id"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    isRequired={requiredFields.includes("enterprise_id")}
                  >
                    Enterprise
                  </FieldLabel>
                  <EnterpriseSelect formField={field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        )}

        <div>
          <Controller
            control={form.control}
            name="payment_method"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  isRequired={requiredFields.includes("payment_method")}
                >
                  Payment Method
                </FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="uppercase w-full">
                    <SelectValue placeholder="Select Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentMethod).map((type) => (
                      <SelectItem
                        className="uppercase w-full"
                        key={type}
                        value={type}
                      >
                        {enumDisplay(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="col-span-2 xl:col-span-3">
          <Controller
            control={form.control}
            name="tags"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Tags</FieldLabel>
                <Popover
                  open={tagsPopoverOpen}
                  onOpenChange={setTagsPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span>
                        {(field.value?.length || 0) > 0
                          ? `${field.value?.length || 0} tag(s) selected`
                          : "Select tags"}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="max-h-60 overflow-auto p-2">
                      {programTags.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          No tags available
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {programTags.map((tag) => (
                            <label
                              key={tag.id}
                              className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                            >
                              <Checkbox
                                checked={field.value?.includes(tag.id) || false}
                                onCheckedChange={() =>
                                  toggleTag(
                                    tag.id,
                                    field.value || [],
                                    field.onChange
                                  )
                                }
                              />
                              <span className="text-sm">{tag.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                {(field.value?.length || 0) > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((tagId) => (
                      <Badge key={tagId} variant="secondary" className="gap-1">
                        {getTagName(tagId)}
                        <button
                          type="button"
                          onClick={() =>
                            removeTag(tagId, field.value || [], field.onChange)
                          }
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
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
