import { Subject } from "./server";
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
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

export default function SubjectAreaSelectList({
  subjects,
  onSelect,
  defaultValue,
  selectedSubjects,
}: {
  subjects: Subject[];
  onSelect?: (value: string) => void;
  defaultValue?: string;
  selectedSubjects?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between whitespace-normal! text-left! max-h-full! min-h-10 truncate!"
        >
          {value
            ? subjects.map((subject) => {
                return subject.sub_subject_areas.map((subSubjectArea) => {
                  if (subSubjectArea.id === value) {
                    return subject.name + " - " + subSubjectArea.name;
                  }
                });
              })
            : "Select subject..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No subject found.</CommandEmpty>
            {subjects.map((subject) => (
              <CommandGroup key={subject.id} heading={subject.name}>
                {subject.sub_subject_areas
                  .filter(
                    (subSubjectArea) =>
                      !selectedSubjects?.some(
                        (selectedSubject) =>
                          selectedSubject === subSubjectArea.id
                      )
                  )
                  .map((subSubjectArea) => (
                    <CommandItem
                      key={subSubjectArea.id}
                      value={subSubjectArea.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        onSelect?.(currentValue);
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === subSubjectArea.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {subSubjectArea.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
