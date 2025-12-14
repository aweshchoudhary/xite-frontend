"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/modules/common/lib/utils";
import { Button } from "@/modules/common/components/ui/button";
import { Calendar } from "@/modules/common/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/common/components/ui/popover";

type DateFormField = {
  value?: Date | null;
  onChange?: (value?: Date | null) => void;
};

export function DatePickerField({ formField }: { formField?: DateFormField }) {
  const [date, setDate] = React.useState<Date | null | undefined>(
    formField?.value
  );

  return (
    <Popover>
      <PopoverTrigger className="w-full" asChild>
        <Button
          variant={"outline"}
          size="sm"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 size-4" strokeWidth={1} />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={(date) => {
            setDate(date);
            formField?.onChange?.(date ?? undefined);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
