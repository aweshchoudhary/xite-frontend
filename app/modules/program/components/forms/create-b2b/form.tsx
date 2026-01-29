"use client";
import { Controller, useForm } from "react-hook-form";
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
import { ChevronDown, X, FileText, Info } from "lucide-react";
import { getProgramTagsAction } from "../update/get-program-tags-action";
import { Checkbox } from "@/modules/common/components/ui/checkbox";
import AcademicPartnerSelect from "../../academic-partner-list";
import EnterpriseSelect from "../../enterprise-partner-list";
import FacultyList from "./faculty-list";
import { uploadFile } from "@/modules/common/services/file-upload";
import { FieldDescription } from "@/modules/microsite-cms/modules/common/components/ui/field";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/modules/common/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/modules/microsite-cms/modules/common/components/ui/alert";

type CreateFormProps = FormBaseProps<CreateSchema>;

export default function CreateForm({
  cancelRedirectPath,
  successRedirectPath,
  defaultValues,
}: CreateFormProps) {
  const form = useForm<CreateSchema>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      ...defaultValues,
    } as Partial<CreateSchema>,
  });

  const { closeModal, redirect } = useFormState();
  const router = useRouter();

  const [programTags, setProgramTags] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [tagsPopoverOpen, setTagsPopoverOpen] = useState(false);
  const [isUploadingProposal, setIsUploadingProposal] = useState(false);
  const [proposalFileName, setProposalFileName] = useState<string | null>(null);

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

  const handleProposalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF, Word document, or Excel file");
        e.target.value = '';
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        e.target.value = '';
        return;
      }

      setIsUploadingProposal(true);
      const { fileUrl, filename } = await uploadFile(file);
      form.setValue("proposal", fileUrl);
      setProposalFileName(filename);
      toast.success("Proposal uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload proposal");
    } finally {
      setIsUploadingProposal(false);
    }
  };

  const handleRemoveProposal = () => {
    form.setValue("proposal", "");
    setProposalFileName(null);
  };

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6"
    >

      {/* <Alert variant="destructive">
        <AlertTitle className="flex items-center gap-2 text-xl">
          <Info className="size-5" /> Validation Issues
        </AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside pl-5 text-base">
            {Object.entries(form.formState.errors).map(([key, value]) => (
            
              <li key={key}><strong>{key}</strong>: {value?.message}</li>
           ))}
          </ul>
        </AlertDescription>
      </Alert> */}
      
      {/* Section 1: Program Details */}
      <section className="border border-border rounded-lg bg-card">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold text-foreground">Program Details</h2>
        </div>
        <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div>
          <Controller
            control={form.control}
            name="program_key"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("program_key")}>
                  Program Key
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      A unique identifier for the program. It will be used in the systems to identify the program.
                    </TooltipContent>
                  </Tooltip>
                </FieldLabel>
                <Input {...field} />
                <FieldDescription>
                  Ex: hdfc-leader, freshworks-innovation 
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        
        
        
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Controller
            control={form.control}
            name="proposal"
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel isRequired={requiredFields.includes("proposal")}>
                  Proposal Document
                </FieldLabel>
                <div className="space-y-2">
                  {proposalFileName ? (
                    <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/20">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm flex-1 truncate font-medium">{proposalFileName}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveProposal}
                        className="h-8 px-2 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleProposalUpload}
                        disabled={isUploadingProposal}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Accepted formats: PDF, Word (.doc, .docx), Excel (.xls, .xlsx). Max size: 10MB
                      </p>
                    </div>
                  )}
                  {isUploadingProposal && (
                    <p className="text-xs text-primary animate-pulse">Uploading...</p>
                  )}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        </div>
        </div>
      </section>

      {/* Section 2: Cohort Details */}
      <section className="border border-border rounded-lg bg-card">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold text-foreground">Cohort Details</h2>
        </div>
        <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </section>

      {/* Section 3: Other Details */}
      <section className="border border-border rounded-lg bg-card">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold text-foreground">Other Details</h2>
        </div>
        <div className="p-6 space-y-6">
        <div className="max-w-md">
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

        <div className="pt-4 border-t border-border">
          <Controller
            control={form.control}
            name="faculties"
            render={({ field, fieldState }) => (
              <FacultyList
                field={field}
                fieldState={fieldState}
                isRequired={requiredFields.includes("faculties")}
              />
            )}
          />
        </div>

        <div className="pt-4 border-t border-border">
          <Curriculum form={form} />
          {form.formState.errors.curriculum?.items && (
            <FieldError errors={[form.formState.errors.curriculum?.items]} />
          )}
        </div>
        </div>
      </section>

      <footer className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button variant="outline" type="button" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : "Create Program"}
        </Button>
      </footer>
    </form>
  );
}
