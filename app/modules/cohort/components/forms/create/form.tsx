"use client";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchema, CreateSchema } from "../schema";
import { createCohortAction, getLastCohortByProgramIdAction } from "./action";
import { toast } from "sonner";
import { useFormState } from "./context";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import CurrencySelect from "@/modules/common/components/global/currency-select/currency-select";
import { DateRangePickerField } from "@/modules/common/components/global/form/date-range-form-field";
import ProgramSelect from "@/modules/program/components/program-select-list";
import { Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { getRequiredFields } from "@/modules/common/lib/zod-required-field-checker";
import { GetOne, getOne } from "@/modules/program/server/read";
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui/field";

interface CreateFormProps extends FormBaseProps<CreateSchema> {}

export default function CreateForm({
  defaultValues,
  onSuccess,
  onCancel,
  successRedirectPath,
  cancelRedirectPath,
}: CreateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requiredFields = useMemo(
    () => getRequiredFields(createSchema),
    []
  );

  const {
    program_id,
    max_cohort_size,
    fees,
    name,
    start_date,
    status,
    end_date,
    format,
    duration,
    location,
  } = defaultValues || {};

  const form = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: {
      program_id,
      max_cohort_size,
      fees,
      name,
      start_date,
      status,
      end_date,
      format,
      duration,
      location,
    },
  });

  const {
    closeModal,
    setDefaultValues,
    defaultValues: formDefaultValues,
    redirect,
  } = useFormState();

  const router = useRouter();

  const feeArray = useFieldArray({
    control: form.control,
    name: "fees",
  });

  const handleSubmit = async (data: CreateSchema) => {
    if (isSubmitting) return; // Prevent multiple submissions

    // Validate required fields
    if (requiredFields.some((field) => !data[field as keyof CreateSchema])) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Clean up empty fee entries
    const cleanedData = {
      ...data,
      fees: data.fees.filter(
        ({ amount, currency_code }) => amount && currency_code && amount > 0
      ),
    };

    setIsSubmitting(true);
    try {
      const { id } = await createCohortAction(cleanedData);
      toast.success("Cohort created successfully");
      form.reset();
      closeModal();
      onSuccess?.();
      redirect(router, `/cohorts/${id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create cohort"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return; // Prevent cancellation during submission

    form.reset();
    closeModal();
    onCancel?.();
    redirect(router, cancelRedirectPath);
  };

  // const [programs, setPrograms] = useState<GetOne[]>([]);
  const [programId, setProgramId] = useState<string>(
    defaultValues?.program_id || ""
  );

  const [program, setProgram] = useState<GetOne | null | undefined>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: program } = await getOne({ id: programId });
      setProgram(program);

      form.setValue("program_id", programId);

      setDefaultValues({
        ...formDefaultValues,
        program_id: programId,
      });

      const lastCohort = await getLastCohortByProgramIdAction(programId);

      const cohortNum = lastCohort?.data?.cohort_num
        ? lastCohort.data.cohort_num + 1
        : 1;

      form.setValue("name", `${program?.name} - Cohort ${cohortNum}`);
    };

    fetchData();
  }, [programId]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "program_id" && value.program_id) {
        setProgramId(value.program_id);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-8"
    >
        {!form.watch("program_id") ? (
          <div>
            <Controller
              name="program_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    isRequired={requiredFields.includes("program_id")}
                  >
                    Program
                  </FieldLabel>
                  <ProgramSelect
                    onChange={(value) => {
                      field.onChange(value);
                      setProgramId(value);
                    }}
                    onObjectChange={(value) => {
                      setProgramId(value.id);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        ) : null}

        {form.watch("program_id") ? (
          <div>
            <div className="mb-10">
              <FieldLabel className="mb-2">Selected Program</FieldLabel>
              <Input
                value={program?.name}
                readOnly
                className="cursor-not-allowed"
              />
            </div>
            <div className="grid lg:grid-cols-3 grid-cols-2 gap-x-4 gap-y-7">
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
                        type="text"
                        placeholder="Name"
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
                  name="format"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel isRequired={requiredFields.includes("format")}>
                        Format
                      </FieldLabel>
                      <Input
                        type="text"
                        placeholder="Online, In-Class, Hybrid"
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
                  name="duration"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        isRequired={requiredFields.includes("duration")}
                      >
                        Duration
                      </FieldLabel>
                      <Input
                        type="text"
                        placeholder="2 weeks, 6 months, etc."
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
                  name="location"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        isRequired={requiredFields.includes("location")}
                      >
                        Location
                      </FieldLabel>
                      <Input
                        type="text"
                        placeholder="Oxford, Dubai, New York, etc."
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
                  name="start_date"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Cohort Dates (Start and End)</FieldLabel>
                      <DateRangePickerField form={form} />
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
                  name="max_cohort_size"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Max Cohort Size (Optional)</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        value={field?.value?.toString() || ""}
                        placeholder="Max Cohort Size"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FieldLabel className="mb-2">Fees</FieldLabel>
                <div className="space-y-2 p-5 rounded-lg border-2 border-dashed bg-background">
                  {feeArray.fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Controller
                          control={form.control}
                          name={`fees.${index}.amount`}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel
                                isRequired={requiredFields.includes("fees")}
                              >
                                Fee
                              </FieldLabel>
                              <Input
                                type="number"
                                {...field}
                                placeholder="Fee"
                                value={field?.value?.toString() || ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                min={0}
                              />
                            </Field>
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <Controller
                          control={form.control}
                          name={`fees.${index}.currency_code`}
                          render={({ field, fieldState }) => (
                            <Field>
                              <FieldLabel>Currency</FieldLabel>
                              <CurrencySelect formField={field} />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </div>
                      <div>
                        <Button
                          variant="ghost"
                          className="text-destructive hover:text-destructive/80"
                          size="icon"
                          onClick={() => feeArray.remove(index)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {feeArray.fields.length === 0 && (
                    <div>
                      <p className="text-muted-foreground text-sm">
                        No fees added
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="mt-2"
                  type="button"
                  size="sm"
                  onClick={() =>
                    feeArray.append({ currency_code: "", amount: 0 })
                  }
                >
                  <Plus className="size-5" />
                  Add Fee
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        <footer className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Cohort"}
          </Button>
        </footer>
    </form>
  );
}
