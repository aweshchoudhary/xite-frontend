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

type MinimalFormApi = {
  getValues: (name: string) => unknown;
  setValue: (name: string, value: unknown) => void;
};

export function DateRangePickerFieldFlexible<T extends Record<string, unknown>>({
  form,
  startFieldName,
  endFieldName,
}: {
  form?: UseFormReturn<T> | MinimalFormApi;
  startFieldName: string;
  endFieldName: string;
}) {
  const getFormValue = (name: string): Date | null | undefined => {
    if (!form) return undefined;
    const api = form as unknown as MinimalFormApi;
    const value = api.getValues(name);
    return value as Date | null | undefined;
  };

  const setFormValue = (
    name: string,
    value: Date | null | undefined
  ) => {
    if (!form) return;
    const api = form as unknown as MinimalFormApi;
    api.setValue(name, value);
  };

  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const startValue = getFormValue(startFieldName);
    const endValue = getFormValue(endFieldName);
    return {
      from: (startValue ?? undefined) as Date | undefined,
      to: (endValue ?? undefined) as Date | undefined,
    };
  });

  React.useEffect(() => {
    if (date?.from && date?.to) {
      setFormValue(startFieldName, date.from);
      setFormValue(endFieldName, date.to);
    } else if (date === undefined) {
      setFormValue(startFieldName, null);
      setFormValue(endFieldName, null);
    }
  }, [date, startFieldName, endFieldName]);

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

