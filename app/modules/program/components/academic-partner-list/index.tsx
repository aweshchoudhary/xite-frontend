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
import { GetOne } from "@/modules/academic-partner/server/read";
import { cn, getImageUrl } from "@/modules/common/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import { useEffect, useState } from "react";
import { getAcademicPartnersAction } from "./action";
import CreateModal from "@/modules/academic-partner/components/forms/create/modal";

export default function AcademicPartnerSelect({
  formField,
}: {
  formField: {
    value?: string | null;
    onChange: (value: string | null) => void;
  };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [academicPartners, setAcademicPartners] = useState<GetOne[]>([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(formField.value ?? "");

  useEffect(() => {
    const fetchAcademicPartners = async () => {
      const { data: academicPartners } = await getAcademicPartnersAction();

      setAcademicPartners(academicPartners ?? []);
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
                {academicPartners.map(
                  (academicPartner) =>
                    academicPartner.id === value && (
                      <div key={value} className="flex items-center gap-2">
                        <Avatar className="size-7">
                          {academicPartner.logo_url && (
                            <AvatarImage
                              src={getImageUrl(academicPartner.logo_url)}
                            />
                          )}
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
        <PopoverContent className="w-full p-0">
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
                        {academicPartner.logo_url && (
                          <AvatarImage
                            src={getImageUrl(academicPartner.logo_url)}
                          />
                        )}
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
