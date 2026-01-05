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
import { GetOne } from "@/modules/program/server/read";
import { cn } from "@/modules/common/lib/utils";
import { Button } from "@ui/button";
import { useEffect, useState } from "react";
import { getAllAction } from "./action";
import CreateProgramModal from "../forms/create/modal";

export default function ProgramSelect({
  onChange,
  defaultValue,
  onObjectChange,
}: {
  onChange: (value: string) => void;
  onObjectChange?: (value: GetOne) => void;
  defaultValue?: string;
}) {
  const [defaultOpen, setDefaultOpen] = useState(false);

  const [programs, setPrograms] = useState<GetOne[]>([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const fetchAcademicPartners = async () => {
      const { data } = await getAllAction();

      setPrograms(data ?? []);
    };
    fetchAcademicPartners();
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
            {value ? (
              <>
                {programs.map(
                  (program) =>
                    program.id === value && (
                      <div key={value} className="flex items-center gap-2">
                        {program.name}
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
              <CommandEmpty>No programs found.</CommandEmpty>
              <CommandGroup>
                {programs.map((program) => (
                  <CommandItem
                    key={program.id}
                    value={program.id}
                    keywords={[program.name]}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      onChange(currentValue);
                      onObjectChange?.(program);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {program.name}
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === program.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <CreateProgramModal
        setOpen={setDefaultOpen}
        open={defaultOpen}
        noTrigger
      />
    </div>
  );
}
