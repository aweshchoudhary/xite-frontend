"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/modules/common/lib/utils";
import { Button } from "@ui/button";
import { Calendar } from "@ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { DateRange } from "react-day-picker";
import { UseFormReturn } from "react-hook-form";

type DateRangeFormShape = {
  start_date?: Date | null;
  end_date?: Date | null;
};

type MinimalFormApi = {
  getValues: (name: "start_date" | "end_date") => unknown;
  setValue: (name: "start_date" | "end_date", value: unknown) => void;
};

export function DateRangePickerField<T extends Record<string, unknown>>({
  form,
}: {
  form?: UseFormReturn<T> | MinimalFormApi;
}) {
  const getFormValue = (
    name: "start_date" | "end_date"
  ): Date | null | undefined => {
    if (!form) return undefined;
    const api = form as unknown as MinimalFormApi;
    const value = api.getValues(name);
    return value as Date | null | undefined;
  };

  const setFormValue = (
    name: "start_date" | "end_date",
    value: Date | null | undefined
  ) => {
    if (!form) return;
    const api = form as unknown as MinimalFormApi;
    api.setValue(name, value);
  };

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: (getFormValue("start_date") ?? undefined) as Date | undefined,
    to: (getFormValue("end_date") ?? undefined) as Date | undefined,
  });

  React.useEffect(() => {
    if (date?.from && date?.to) {
      setFormValue("start_date", date.from);
      setFormValue("end_date", date.to);
    }
  }, [date]);

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
