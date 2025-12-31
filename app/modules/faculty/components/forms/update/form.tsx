"use client";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "../schema";
import { updateAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import { Input } from "@ui/input";
import { Button, buttonVariants } from "@ui/button";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MODULE_NAME } from "@/modules/faculty/contants";
import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Label } from "@ui/label";
import { cn, getImageUrl } from "@/modules/common/lib/utils";
import { FormUpdateBaseProps } from "@/modules/common/components/global/form/types/form-props";
import ImageSelector from "@/modules/common/components/global/image-selector";
import { generatePreviewUrl } from "@/modules/common/lib/img-preview-url-generator";
import AcademicPartnerSelect from "@/modules/program/components/academic-partner-list";
import PhoneInput from "react-phone-number-input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@ui/select";
import { getFacultyCodes, FacultyCode } from "../create/server";
import { Plus, X } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@ui/field";
import TopicSelectList from "@/modules/cohort/components/topic-select-list";
import SubTopicSelectList from "@/modules/cohort/components/subtopic-select-list";
import { getRequiredFields } from "@/modules/common/lib/zod-required-field-checker";

type UpdateFormProps = FormUpdateBaseProps<UpdateSchema>;

export default function UpdateForm({
  currentData,
  cancelRedirectPath,
  successRedirectPath,
}: UpdateFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      ...currentData,
      subtopics:
        currentData.subtopics && currentData.subtopics.length > 0
          ? currentData.subtopics
          : [{ topic_id: null, sub_topic_id: null }],
    },
  });

  const { closeModal, setDefaultValues, redirect } = useFormState();
  const [facultyCodes, setFacultyCodes] = useState<FacultyCode[] | null>(null);

  const requiredFields = useMemo(
    () => getRequiredFields(updateSchema),
    []
  );

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
      ...currentData,
    });
  }, [currentData, setDefaultValues]);

  const subtopicsFieldArray = useFieldArray({
    control: form.control,
    name: "subtopics",
  });

  useEffect(() => {
    const fetchFacultyCodes = async () => {
      const fetchedFacultyCodes = await getFacultyCodes();
      setFacultyCodes(fetchedFacultyCodes);
    };
    fetchFacultyCodes();
  }, []);

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-8"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Controller
            control={form.control}
            name="profile_image_file"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Profile Image</FieldLabel>
                <Label htmlFor="image-selector">
                  <ImageSelector
                    setSelectedImage={(image) => {
                      field.onChange(image);
                    }}
                  />
                  <Avatar className="size-20 border">
                    <AvatarImage
                      src={
                        field.value
                          ? generatePreviewUrl(field.value) ?? ""
                          : getImageUrl(currentData.profile_image ?? "")
                      }
                    />
                    <AvatarFallback className="uppercase">
                      {form.watch("name")
                        ? form.watch("name")?.slice(0, 2)
                        : ""}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "mt-2 text-xs"
                    )}
                  >
                    Upload
                  </div>
                </Label>
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
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("name")}>
                  Name
                </FieldLabel>
                <Input placeholder="Name" {...field} />
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
            name="preferred_name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  isRequired={requiredFields.includes("preferred_name")}
                >
                  Preferred Name
                </FieldLabel>
                <Input
                  placeholder="Preferred Name"
                  {...field}
                  value={field.value ?? ""}
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
            name="faculty_code_id"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  isRequired={requiredFields.includes("faculty_code_id")}
                >
                  Faculty Category
                </FieldLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  defaultValue={field.value ?? undefined}
                >
                  <SelectTrigger className="w-full capitalize">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {facultyCodes?.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id}
                        className="capitalize"
                      >
                        {type.name}
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
            name="phone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("phone")}>
                  Phone
                </FieldLabel>
                <PhoneInput
                  className="w-full border px-3 py-1.5 rounded-md shadow-xs"
                  {...field}
                  placeholder="Phone"
                  international
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
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("email")}>
                  Email
                </FieldLabel>
                <Input type="email" placeholder="Email" {...field} />
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
        <div className="col-span-2 space-y-4">
          <div>
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel isRequired={requiredFields.includes("title")}>
                    Title
                  </FieldLabel>
                  <Input
                    type="text"
                    placeholder="Title"
                    {...field}
                    value={field.value ?? ""}
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
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    isRequired={requiredFields.includes("description")}
                  >
                    Description
                  </FieldLabel>
                  <TextEditor placeholder="Description" formField={field} />
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
              name="note"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel isRequired={requiredFields.includes("note")}>
                    Note
                  </FieldLabel>
                  <TextEditor placeholder="Note" formField={field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>
        <div>
          <FieldLabel className="mb-2">Topics & Subtopics</FieldLabel>
          <div className="space-y-4">
            {subtopicsFieldArray.fields.map((field, index) => (
              <div key={field.id} className="space-y-3 border p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Topic/Subtopic #{index + 1}
                  </span>
                  <Button
                    type="button"
                    onClick={() => subtopicsFieldArray.remove(index)}
                    variant="outline"
                    size="icon"
                    className="text-red-700"
                  >
                    <X className="size-4" strokeWidth={1.5} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Topic</FieldLabel>
                    <Controller
                      control={form.control}
                      name={`subtopics.${index}.topic_id`}
                      render={({ field, fieldState }) => (
                        <>
                          <TopicSelectList
                            onChange={(value) => {
                              field.onChange(value);
                              // Clear subtopic when topic changes
                              form.setValue(
                                `subtopics.${index}.sub_topic_id`,
                                null
                              );
                            }}
                            defaultValue={field.value ?? undefined}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </>
                      )}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>SubTopic</FieldLabel>
                    <Controller
                      control={form.control}
                      name={`subtopics.${index}.sub_topic_id`}
                      render={({ field, fieldState }) => {
                        const topicId = form.watch(
                          `subtopics.${index}.topic_id`
                        );
                        // Get all selected subtopic IDs except the current field's selection
                        const allSubtopics = form.watch("subtopics") || [];
                        const selectedSubtopicIds = allSubtopics
                          .map((st) => st?.sub_topic_id)
                          .filter(
                            (id): id is string =>
                              Boolean(id) && id !== field.value
                          );
                        return (
                          <>
                            <SubTopicSelectList
                              onChange={field.onChange}
                              topicId={topicId}
                              disabled={!topicId}
                              defaultValue={field.value ?? undefined}
                              excludeSubtopics={selectedSubtopicIds}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </>
                        );
                      }}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={() =>
              subtopicsFieldArray.append({
                topic_id: null,
                sub_topic_id: null,
              })
            }
            size="sm"
            className="mt-3"
          >
            <Plus className="size-4" strokeWidth={1.5} /> Add Topic/Subtopic
          </Button>
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
