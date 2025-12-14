"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/modules/common/lib/utils";
import { Button } from "@/modules/common/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/modules/common/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/common/components/ui/popover";
import currencies from "@/modules/common/lib/currencies.json";

type CurrencyField = {
  value?: string;
  onChange?: (value?: string) => void;
  onBlur?: () => void;
};

export default function CurrencySelect({
  formField,
}: {
  formField?: CurrencyField;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (formField?.value) {
      const currency = currencies.find(
        (currency) => currency.code === formField?.value
      );
      setValue(`${currency?.code}-${currency?.name}-${currency?.namePlural}`);
    }
  }, [formField?.value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? currencies.find(
                (currency) =>
                  `${currency.code}-${currency.name}-${currency.namePlural}` ===
                  value
              )?.name
            : "Select Currency"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No Currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.code}
                  value={`${currency.code}-${currency.name}-${currency.namePlural}`}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    const currency = currencies.find(
                      (c) =>
                        `${c.code}-${c.name}-${c.namePlural}` === currentValue
                    );
                    formField?.onChange?.(currency?.code);
                    formField?.onBlur?.();
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === currency.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {currency.name} ({currency.code})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
