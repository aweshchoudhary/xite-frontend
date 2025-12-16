"use client";
import {
  Controller,
  UseFormReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "./schema";
import { toast } from "sonner";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { updateAction } from "./actions";
import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import MicrositeAdditionalFields from "@/modules/cohort/modules/cohort-content/common/components/microsite-additional-fields-update";
import { Plus, Trash } from "lucide-react";
import ImageSelectorField from "@/modules/common/components/global/form/image-selector-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import {
  CohortSectionWithData,
  GetCohort,
  GetCohortSectionOrderBySectionIdOutput,
  getCohortSectionOrderBySectionId,
  getCohortSections,
} from "@/modules/cohort/server/cohort/read";
import { useEffect, useState } from "react";
import FormColorPicker from "@/modules/common/components/global/form/form-color-picker";
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui/field";

interface CreateFormProps extends FormBaseProps<UpdateSchema> {
  cohortData: GetCohort;
}

export default function CreateForm({
  defaultValues,
  onSuccess,
  onCancel,
  cohortData,
}: CreateFormProps) {
  const [cohortSections, setCohortSections] = useState<CohortSectionWithData[]>(
    []
  );

  const form = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: defaultValues as UpdateSchema,
  });

  const handleSubmit = async (data: UpdateSchema) => {
    try {
      let hasZeroPosition = false;

      // Validate section positions
      data.sections.forEach((section, index) => {
        if (!section.after_section_id) {
          form.setError(`sections.${index}.after_section_id`, {
            message: "Please select a valid section position",
          });
          hasZeroPosition = true;
          return;
        }
      });

      // Stop execution if invalid positions found
      if (hasZeroPosition) return;

      // Call update action
      await updateAction({
        data,
        currentSections: defaultValues?.sections || [],
        cohortData,
      });

      toast.success("Custom Sections updated");
      onSuccess?.();
    } catch (error) {
      console.error("Error updating sections:", error);
      toast.error("Error updating Custom Sections section");
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  const sections = useFieldArray({
    control: form.control,
    name: "sections",
  });

  useEffect(() => {
    const fetchCohortSections = async () => {
      const cohortSections = await getCohortSections(cohortData.id);
      setCohortSections(cohortSections);
    };
    fetchCohortSections();
  }, [cohortData]);

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-5"
    >
        {sections.fields.map((field, index) => (
          <SectionFormField
            key={field.id}
            index={index}
            form={form}
            cohortSections={cohortSections}
            defaultValues={defaultValues as any}
            sections={sections.fields}
          />
        ))}

        <div>
          <Button
            type="button"
            size={"sm"}
            variant={"outline"}
            onClick={() =>
              sections.append({
                title: "",
                description: "",
                top_description: "",
                bottom_description: "",
                after_section_id: "",
              })
            }
          >
            <Plus className="size-4" />
            Add Section
          </Button>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={handleCancel}
            disabled={form.formState.isSubmitting}
            size={"sm"}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            size={"sm"}
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface SectionFormFieldProps {
  index: number;
  form: UseFormReturn<any>;
  cohortSections: CohortSectionWithData[];
  defaultValues: Partial<UpdateSchema>;
  sections: any;
}

export const SectionFormField = ({
  index,
  form,
  cohortSections,
  sections,
}: SectionFormFieldProps) => {
  const [currentSectionOrder, setCurrentSectionOrder] =
    useState<GetCohortSectionOrderBySectionIdOutput | null>(null);
  const sectionId = form.watch(`sections.${index}.id`);
  const [afterSectionId, setAfterSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionId) return;
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        const [current] = await Promise.all([
          getCohortSectionOrderBySectionId(sectionId),
        ]);

        if (isMounted) {
          setCurrentSectionOrder(current);
          getAfterSectionId(current.section_position);
        }
      } catch (error) {
        console.error("Error fetching section order:", error);
      }
    };

    const getAfterSectionId = async (currentSectionPosition: number) => {
      const afterSectionId = cohortSections.find(
        (sec) => currentSectionPosition === sec.section_position + 1
      )?.section_id;

      setAfterSectionId(afterSectionId || null);
      form.setValue(`sections.${index}.after_section_id`, afterSectionId || "");
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, [sectionId, cohortSections]);

  console.log({ afterSectionId });

  return (
    <div className="space-y-4 p-5 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Section #{index + 1}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => sections.remove(index)}
          type="button"
          className="text-destructive hover:text-destructive/80"
        >
          <Trash className="size-4" />
          Remove
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Banner image */}
        <div className="shrink-0 md:w-1/4 w-full">
          <Controller
            control={form.control}
            name={`sections.${index}.banner_image_file`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="relative">
                  <ImageSelectorField
                    form={form}
                    field={field}
                    imageUrlFieldName={`sections.${index}.banner_image_url`}
                    imageFileFieldName={`sections.${index}.banner_image_file`}
                    className="size-full aspect-square rounded-md"
                    imageClassName="size-full object-contain rounded-none"
                  />
                  <div className="absolute bottom-0 right-0 p-2">
                    <Controller
                      control={form.control}
                      name={`sections.${index}.banner_image_position`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Select
                            value={field.value || ""}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Position" />
                            </SelectTrigger>
                            <SelectContent>
                              {["left", "right", "center", "top", "bottom"].map(
                                (pos) => (
                                  <SelectItem key={pos} value={pos}>
                                    {pos[0].toUpperCase() + pos.slice(1)}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Section Details */}
        <div className="space-y-3 flex-1">
          <div className="flex gap-5">
            {/* Position (After section) */}
            <Controller
              control={form.control}
              name={`sections.${index}.after_section_id`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Select
                    value={afterSectionId || field.value || ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setAfterSectionId(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Section Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first">First Section</SelectItem>
                      {cohortSections
                        .sort((a, b) => a.section_position - b.section_position)
                        .map((section) =>
                          section.section_id !==
                          currentSectionOrder?.section_id ? (
                            <SelectItem
                              key={section.section_id}
                              value={section.section_id}
                            >
                              After - {section?.data?.title}
                            </SelectItem>
                          ) : null
                        )}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Position (After section) */}
            <Controller
              control={form.control}
              name={`sections.${index}.background`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FormColorPicker
                    form={form}
                    textColorName={`sections.${index}.background.text_color`}
                    backgroundColorName={`sections.${index}.background.background_color`}
                    label="Section Color Scheme"
                    isBackground={true}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Title */}
          <Controller
            control={form.control}
            name={`sections.${index}.title`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  placeholder="Section Title: Program Overview"
                  {...field}
                  className="text-lg font-medium"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Description */}
          <Controller
            control={form.control}
            name={`sections.${index}.description`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <TextEditor
                  placeholder="Add a comprehensive overview of your program..."
                  defaultValue={field.value}
                  formField={field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Additional Fields */}
          <MicrositeAdditionalFields
            form={form}
            top_desc_field_name={`sections.${index}.top_description`}
            bottom_desc_field_name={`sections.${index}.bottom_description`}
          />
        </div>
      </div>
    </div>
  );
};
