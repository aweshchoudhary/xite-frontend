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
import { ITemplate } from "@microsite-cms/common/services/db/types/interfaces";
import { cn } from "@/modules/common/lib/utils";
import { Button } from "@ui/button";
import { useEffect, useState } from "react";
import { getTemplateListAction } from "./action";

export default function TemplateSelectList({
  onChange,
  defaultValue,
}: {
  onChange: (value: string) => void;
  defaultValue?: string | null;
}) {
  const [templateList, setTemplateList] = useState<ITemplate[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTemplateList = async () => {
      const templates = await getTemplateListAction();
      setTemplateList(templates);
    };
    fetchTemplateList();
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
                {templateList.map(
                  (template) =>
                    template._id === defaultValue && (
                      <div
                        key={defaultValue}
                        className="flex items-center gap-2 truncate"
                      >
                        {template.name}
                      </div>
                    )
                )}
              </>
            ) : (
              "Select template"
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search template..." className="h-full w-full" />
            <CommandList>
              <CommandEmpty>No templates found.</CommandEmpty>
              <CommandGroup>
                {templateList.map((template) => (
                  <CommandItem
                    key={template._id}
                    value={template._id ?? ""}
                    keywords={[template.name ?? ""]}
                    onSelect={(currentValue) => {
                      setOpen(false);
                      onChange(currentValue);
                    }}
                  >
                    <div className="flex items-center gap-2">{template.name}</div>
                    <Check
                      className={cn(
                        "ml-auto",
                        defaultValue === (template._id ?? "") ? "opacity-100" : "opacity-0"
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

