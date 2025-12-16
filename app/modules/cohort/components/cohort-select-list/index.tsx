"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { GetCohortByProgramId } from "@/modules/cohort/server/cohort/read";
import { cn } from "@/modules/common/lib/utils";
import { Button } from "@ui/button";
import { useEffect, useState } from "react";
import { getCohortListAction } from "./action";

export default function CohortSelectList({
  onChange,
  defaultValue,
}: {
  onChange: (value: string) => void;
  defaultValue?: string | null;
}) {
  const [cohortList, setCohortList] = useState<GetCohortByProgramId[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCohortList = async () => {
      const cohorts = await getCohortListAction();
      setCohortList(cohorts);
    };
    fetchCohortList();
  }, []);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {defaultValue ? (
              <>
                {cohortList.map(
                  (cohort) =>
                    cohort.cohort_key === defaultValue && (
                      <div
                        key={defaultValue}
                        className="flex items-center gap-2 truncate"
                      >
                        {cohort.name}
                      </div>
                    )
                )}
              </>
            ) : (
              "Select"
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Select" className="h-full w-full" />
            <CommandList>
              <CommandEmpty>No Data found.</CommandEmpty>
              <CommandGroup>
                {cohortList.map((cohort) => (
                  <CommandItem
                    key={cohort.id}
                    value={cohort.cohort_key}
                    keywords={[cohort.name ?? ""]}
                    onSelect={(currentValue) => {
                      setOpen(false);
                      onChange(currentValue);
                    }}
                  >
                    <div className="flex items-center gap-2">{cohort.name}</div>
                    <Check
                      className={cn(
                        "ml-auto",
                        defaultValue === cohort.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
