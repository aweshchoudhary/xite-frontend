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
import { GetOneOutput } from "@/modules/enterprise/server/read";
import { cn } from "@/modules/common/lib/utils";
import { Button } from "@ui/button";
import { useEffect, useState } from "react";
import { getEnterpriseListAction } from "./action";
import CreateModal from "../forms/create/modal";

export default function EnterpriseSelect({
  formField,
}: {
  formField: {
    value?: string | null;
    onChange: (value: string | null) => void;
  };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enterpriseList, setEnterpriseList] = useState<GetOneOutput[]>([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(formField.value ?? "");

  useEffect(() => {
    const fetchEnterpriseList = async () => {
      const enterpriseList = await getEnterpriseListAction();

      setEnterpriseList(enterpriseList);
    };
    fetchEnterpriseList();
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
                {enterpriseList.map(
                  (enterprise) =>
                    enterprise.id === value && (
                      <div key={value} className="flex items-center gap-2">
                        {enterprise.name}
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
                {enterpriseList.map((enterprise) => (
                  <CommandItem
                    key={enterprise.id}
                    value={enterprise.id}
                    keywords={[enterprise.name]}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      formField.onChange(currentValue);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {enterprise.name}
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === enterprise.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              {/* <CommandSeparator />
              <CommandItem>
                <Plus className="size-4" />
                Create new
              </CommandItem> */}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateModal noTrigger open={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
}
