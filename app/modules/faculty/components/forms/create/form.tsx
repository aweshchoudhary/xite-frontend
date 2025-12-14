"use client";
import { Controller, Form, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchema, CreateSchema } from "../schema";
import { createAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import PhoneInput from "react-phone-number-input";

import { Input } from "@/modules/common/components/ui/input";
import { Button, buttonVariants } from "@/modules/common/components/ui/button";
import { MODULE_NAME } from "@/modules/faculty/contants";
import TextEditor from "@/modules/common/components/global/rich-editor/text-editor";
import AcademicPartnerSelect from "@/modules/program/components/academic-partner-list";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { useRouter } from "next/navigation";
import { Label } from "@/modules/common/components/ui/label";
import ImageSelector from "@/modules/common/components/global/image-selector";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/modules/common/components/ui/avatar";
import { generatePreviewUrl } from "@/modules/common/lib/img-preview-url-generator";
import { cn } from "@/modules/common/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/common/components/ui/select";
import { useEffect, useState } from "react";
import { FacultyCode, getFacultyCodes, getSubjects, Subject } from "./server";
import SubjectAreaSelectList from "./subject-area-select-list";
import { Plus, X } from "lucide-react";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/modules/common/components/ui/field";

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
      phone: "",
      academic_partner_id: "",
      faculty_code_id: "",
      faculty_subject_areas: [""],
      ...defaultValues,
    },
  });

  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [selectedSubSubjects, setSelectedSubSubjects] = useState<string[]>([]);
  const [facultyCodes, setFacultyCodes] = useState<FacultyCode[] | null>(null);

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

  const subjectAreasFieldArray = useFieldArray({
    control: form.control,
    // @ts-expect-error This is a valid field
    name: "faculty_subject_areas",
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      const fetchedSubjects = await getSubjects();
      setSubjects(fetchedSubjects);
    };
    fetchSubjects();
    const fetchFacultyCodes = async () => {
      const fetchedFacultyCodes = await getFacultyCodes();
      setFacultyCodes(fetchedFacultyCodes);
    };
    fetchFacultyCodes();
  }, []);
  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3">
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
                      {form.watch("profile_image_file") && (
                        <AvatarImage
                          src={
                            generatePreviewUrl(
                              form.watch("profile_image_file")!
                            ) ?? ""
                          }
                        />
                      )}
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
                  <FieldLabel>Name</FieldLabel>
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
                  <FieldLabel>Preferred Name</FieldLabel>
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
                  <FieldLabel>Faculty Category</FieldLabel>
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
                  <FieldLabel>Phone</FieldLabel>
                  <PhoneInput
                    className="w-full border px-3 py-1.5 rounded-md bg-background"
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
                  <FieldLabel>Email</FieldLabel>
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
                  <FieldLabel>Academic Partner</FieldLabel>
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
                    <FieldLabel>Title</FieldLabel>
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
                    <FieldLabel>Description</FieldLabel>
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
                    <FieldLabel>Note</FieldLabel>
                    <TextEditor placeholder="Note" formField={field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
          <div className="border-2 border-dashed bg-background p-5">
            <FieldLabel className="mb-2">Subject Areas</FieldLabel>
            <div className="space-y-2">
              {subjectAreasFieldArray.fields.map((field, index) => (
                <div key={field.id} className="space-y-3">
                  <Controller
                    control={form.control}
                    name={`faculty_subject_areas.${index}`}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <SubjectAreaSelectList
                              subjects={subjects ?? []}
                              onSelect={(value) => {
                                field.onChange(value);
                                setSelectedSubSubjects([
                                  ...selectedSubSubjects,
                                  value,
                                ]);
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => subjectAreasFieldArray.remove(index)}
                            variant="outline"
                            size="icon"
                            className="text-red-700"
                          >
                            <X className="size-4" strokeWidth={1.5} />
                          </Button>
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                subjectAreasFieldArray.append({
                  name: "",
                })
              }
              size="sm"
              className="mt-3"
            >
              <Plus className="size-4" strokeWidth={1.5} /> Subject Area
            </Button>
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
