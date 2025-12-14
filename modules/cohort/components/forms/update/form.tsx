"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateSchema } from "../schema";
import { updateCohortAction } from "./action";
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DateRangePickerField } from "@/modules/common/components/global/form/date-range-form-field";
import CurrencySelect from "@/modules/common/components/global/currency-select/currency-select";
import { Plus, Trash } from "lucide-react";
import { FormUpdateBaseProps } from "@/modules/common/components/global/form/types/form-props";
import ProgramSelect from "@/modules/program/components/program-select-list";
import { GetOne } from "@/modules/program/server/read";
import { getOne } from "@/modules/program/server/read";

interface UpdateFormProps extends FormUpdateBaseProps<UpdateSchema> {}

export default function UpdateForm({
  currentData,
  cancelRedirectPath,
  successRedirectPath,
}: UpdateFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: currentData,
  });

  const feeArray = useFieldArray({
    control: form.control,
    name: "fees",
  });

  const [programId, setProgramId] = useState<string>(
    currentData?.program_id || ""
  );

  const [program, setProgram] = useState<GetOne | null | undefined>(null);

  const { closeModal, setDefaultValues, redirect } = useFormState();

  const handleSubmit = async (data: UpdateSchema) => {
    try {
      const feesToDelete = currentData.fees.filter((fee) => {
        const feeToDelete = data.fees.find((f) => f.id === fee.id);
        if (feeToDelete) return;

        fee.action = "delete";
        return fee;
      });

      await updateCohortAction(
        { ...data, fees: [...data.fees, ...feesToDelete] },
        currentData.id
      );
      toast.success("Cohort updated successfully");
      form.reset();
      closeModal();
      redirect(router, successRedirectPath);
    } catch (error) {
      toast.error("Failed to update cohort");
      console.error(error);
    }
  };

  const handleCancel = () => {
    form.reset();
    closeModal();
    redirect(router, cancelRedirectPath);
  };

  useEffect(() => {
    setDefaultValues(currentData);
  }, [currentData, setDefaultValues]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: program } = await getOne({ id: programId });
      setProgram(program);

      form.setValue("program_id", programId);

      setDefaultValues({
        ...currentData,
        program_id: programId,
      });
    };

    fetchData();
  }, [programId]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {!form.watch("program_id") ? (
          <div>
            <FormField
              control={form.control}
              name="program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <FormControl>
                    <ProgramSelect
                      onChange={(value) => {
                        field.onChange(value);
                        setProgramId(value);
                      }}
                      onObjectChange={(value) => {
                        setProgramId(value.id);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : null}

        {form.watch("program_id") ? (
          <div>
            <div className="mb-10">
              <FormLabel className="mb-2">Selected Program</FormLabel>
              <Input
                value={program?.name}
                readOnly
                className="cursor-not-allowed"
              />
            </div>
            <div className="grid lg:grid-cols-3 grid-cols-2 gap-x-4 gap-y-7">
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Name"
                          {...field}
                          value={field.value ?? ""}
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
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Format</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Online, In-Class, Hybrid"
                          {...field}
                          value={field.value ?? ""}
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
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="2 weeks, 6 months, etc."
                          {...field}
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Oxford, Dubai, New York, etc."
                          {...field}
                          value={field?.value ?? ""}
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
                  name="start_date"
                  render={() => (
                    <FormItem>
                      <FormLabel>Cohort Dates (Start and End)</FormLabel>
                      <FormControl>
                        <DateRangePickerField form={form} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="max_cohort_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Cohort Size (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          value={field?.value?.toString() || ""}
                          placeholder="Max Cohort Size"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormLabel className="mb-3">
                  Max Cohort Size (Optional)
                </FormLabel>
                <div className="space-y-2">
                  {feeArray.fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`fees.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fee</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  placeholder="Fee"
                                  value={field.value?.toString() || ""}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  min={0}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`fees.${index}.currency_code`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <FormControl>
                                <CurrencySelect formField={field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
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
                </div>
                <Button
                  variant="outline"
                  className="mt-2"
                  type="button"
                  size="sm"
                  onClick={() =>
                    feeArray.append({
                      currency_code: "",
                      amount: 0,
                      action: "create",
                    })
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
