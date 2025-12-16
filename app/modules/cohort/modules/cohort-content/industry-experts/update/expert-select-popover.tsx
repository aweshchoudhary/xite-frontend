"use client";

import * as React from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { getImageUrl } from "@/modules/common/lib/utils";
import { Button } from "@ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
import { GetAllOutput, getAll } from "@/modules/faculty/server/read";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { toast } from "sonner";
import { addExpertItemToSection } from "./action";
import { Dialog, DialogContent, DialogTrigger } from "@ui/dialog";
type Props = {
  children?: React.ReactNode;
  sectionId: string;
  position: number;
  selectedExpertIds?: string[];
};

export default function IndustryExpertsSelectPopover({
  children,
  sectionId,
  position,
  selectedExpertIds,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [showList, setShowList] = React.useState(false);
  const [experts, setExperts] = React.useState<GetAllOutput>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleSelect = async (currentValue: string) => {
    try {
      toast.promise(
        addExpertItemToSection({
          expertId: currentValue,
          sectionId: sectionId,
          position: position,
        }),
        {
          loading: "Adding expert to section...",
          success: "Expert added to section",
          error: "Failed to add expert to section",
        }
      );
      setOpen(false);
    } catch (error) {
      toast.error("Failed to select expert");
    }
  };

  React.useEffect(() => {
    const fetchExperts = async () => {
      const experts = await getAll();
      setExperts(
        experts.filter((expert) => !selectedExpertIds?.includes(expert.id))
      );
    };
    setShowList(false);
    fetchExperts();
  }, []);

  const handleDeboucedValueChange = React.useCallback((value: string) => {
    setTimeout(() => {
      if (value) setShowList(true);
      else setShowList(false);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-fit justify-between"
          >
            {value
              ? experts.find((expert) => expert.id === value)?.name
              : "Select Expert"}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-fit p-3 shadow">
        <Command>
          <CommandInput
            onValueChange={handleDeboucedValueChange}
            placeholder="Search Expert..."
          />
          {/* don't show list data initially only after the search value is changed */}
          {showList && (
            <CommandList ref={scrollRef}>
              <CommandEmpty>No Expert found.</CommandEmpty>
              <CommandGroup>
                {experts.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={(currentValue) => {
                      handleSelect(currentValue);
                      setValue(currentValue === value ? "" : currentValue);
                    }}
                    keywords={[item.name]}
                  >
                    {/* <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  /> */}

                    <Avatar className="size-7">
                      <AvatarImage
                        loading="lazy"
                        src={getImageUrl(item.profile_image || "")}
                      />
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
