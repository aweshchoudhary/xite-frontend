"use client";

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
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { GetCohortByProgramId } from "@/modules/cohort/server/cohort/read";
import { cn } from "@/modules/common/lib/utils";
import { Button } from "@/modules/common/components/ui/button";
import { useEffect, useState } from "react";
import { getCohortListAction } from "./action";
import CreateModal from "../forms/create/modal";

export default function CohortSelectList({
  onChange,
  programId,
  defaultValue,
}: {
  onChange: (value: string) => void;
  programId: string;
  defaultValue?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cohortList, setCohortList] = useState<GetCohortByProgramId[]>([]);
  const [open, setOpen] = useState(false);

  const fetchCohortList = async () => {
    const cohorts = await getCohortListAction({ programId });
    setCohortList(cohorts ?? []);
  };
  useEffect(() => {
    fetchCohortList();
  }, [programId]);

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
                    cohort.id === defaultValue && (
                      <div
                        key={defaultValue}
                        className="flex items-center gap-2"
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
                    value={cohort.id}
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
      <CreateModal
        onSuccess={() => fetchCohortList()}
        noTrigger
        open={isModalOpen}
        setOpen={setIsModalOpen}
      />
    </div>
  );
}
