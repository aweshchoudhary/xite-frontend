"use client";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchema, CreateSchema } from "./schema";
import { createProgramAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { useEffect, useMemo, useState } from "react";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { useRouter } from "next/navigation";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { getRequiredFields } from "@/modules/common/lib/zod-required-field-checker";
import slugify from "slugify";
import { DatePickerField } from "@/modules/common/components/global/form/date-form-field";
import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import Curriculum from "./curriculum";
import { Badge } from "@/modules/common/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/common/components/ui/popover";
import { ChevronDown, X } from "lucide-react";
import { getProgramTagsAction } from "../update/get-program-tags-action";
import { Checkbox } from "@/modules/common/components/ui/checkbox";
import AcademicPartnerSelect from "../../academic-partner-list";
import EnterpriseSelect from "../../enterprise-partner-list";
import { FieldDescription } from "@/modules/microsite-cms/modules/common/components/ui/field";

type CreateFormProps = FormBaseProps<CreateSchema>;

export default function CreateForm({
  cancelRedirectPath,
  successRedirectPath,
  defaultValues,
}: CreateFormProps) {
  const form = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { closeModal, redirect } = useFormState();
  const router = useRouter();

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

  const requiredFields = useMemo(
    () => getRequiredFields(createSchema),
    []
  );

  const handleSubmit = async (data: CreateSchema) => {
    toast.promise(submitHandler(data), {
      loading: "Creating program...",
      success: "Program created successfully",
      error: "Failed to create program",
    });
  };

  const submitHandler = async (data: CreateSchema) => {
    await createProgramAction(data);
    redirect(router, successRedirectPath);
    closeModal();
  };

  const handleCancel = () => {
    redirect(router, cancelRedirectPath);
    closeModal();
  };

  const tags = useWatch({ control: form.control, name: "tags" }) || [];

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
      <div>
        <h2 className="text-sm text-muted-foreground mb-5">Program Details</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Controller
            control={form.control}
            name="program_name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("program_name")}>
                  Name
                </FieldLabel>
                <Input {...field} onChange={(e) => {
                  field.onChange(e);
                  form.setValue("program_key", slugify(e.target.value, { lower: true }));
                }} />
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
            name="program_short_name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("program_short_name")}>
                  Short Name
                </FieldLabel>
                <Input {...field} />
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
                <Input {...field} />
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
                <FieldLabel isRequired={requiredFields.includes("academic_partner_id")}>
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
        <div>
          <Controller
            control={form.control}
            name="enterprise_id"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("enterprise_id")}>
                  Enterprise Partner
                </FieldLabel>
                <EnterpriseSelect formField={field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

      </div>
      </div>
      <hr />
      <div>
        <h2 className="text-sm text-muted-foreground mb-5">Cohort Details</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Controller
            control={form.control}
            name="cohort_start_date"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("cohort_start_date")}>
                  Start Date
                </FieldLabel>
                <DatePickerField formField={field}/>
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
            name="cohort_end_date"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("cohort_end_date")}>
                  End Date
                </FieldLabel>
                <DatePickerField formField={field}/>
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
            name="cohort_format"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("cohort_format")}>
                  Format
                </FieldLabel>
                <Input {...field} />
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
            name="cohort_duration"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("cohort_duration")}>
                  Duration
                </FieldLabel>
                <Input {...field} />
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
            name="cohort_location"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("cohort_location")}>
                  Location
                </FieldLabel>
                <Input {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>
      </div>

      <hr />

      <div className="space-y-5">
        <div className="max-w-sm">
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
      <div>
          <Controller
            control={form.control}
            name="overview_description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("overview_description")}>
                  Overview Description
                </FieldLabel>
                <TextEditor placeholder="Overview Description" formField={field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>

      <div>
        <Curriculum form={form} />
        {form.formState.errors.curriculum?.items && (
          <FieldError errors={[form.formState.errors.curriculum?.items]} />
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
  );
}
