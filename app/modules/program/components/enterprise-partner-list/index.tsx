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
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { cn, getImageUrl } from "@/modules/common/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import { useEffect, useState } from "react";
import { getDataListAction } from "./action";
import CreateModal from "@/modules/academic-partner/components/forms/create/modal";

export default function EnterpriseSelect({
  formField,
}: {
  formField: {
    value?: string | null;
    onChange: (value: string | null) => void;
  };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [academicPartners, setEnterprises] = useState<PrimaryDB.EnterpriseGetPayload<object>[]>([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(formField.value ?? "");

  useEffect(() => {
    const fetchEnterprises = async () => {
      const { data: academicPartners } = await getDataListAction();

      setEnterprises(academicPartners ?? []);
    };
    fetchEnterprises();
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
                {academicPartners.map(
                  (academicPartner) =>
                    academicPartner.id === value && (
                      <div key={value} className="flex items-center gap-2 truncate">
                        <Avatar className="size-7">
                          <AvatarFallback>
                            {academicPartner.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {academicPartner.name}
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
        <PopoverContent className="w-full max-w-xs p-0">
          <Command>
            <CommandInput placeholder="Select" className="h-full w-full" />
            <CommandList>
              <CommandEmpty>No Data found.</CommandEmpty>
              <CommandGroup>
                {academicPartners.map((academicPartner, index) => (
                  <CommandItem
                    key={index}
                    value={academicPartner.id}
                    keywords={[academicPartner.name]}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      formField.onChange(currentValue);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback>
                          {academicPartner.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {academicPartner.name}
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === academicPartner.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              {/* <CommandSeparator />
              <CommandItem
                onSelect={() => {
                  setIsModalOpen(true);
                }}
              >
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
