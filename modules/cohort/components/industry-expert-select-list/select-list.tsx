"use client";
import { GetOneOutput } from "@/modules/faculty/server/read";
import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/modules/common/components/ui/command";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/modules/common/components/ui/avatar";
import { getDataList } from "./actions";
import { Button } from "@/modules/common/components/ui/button";
import { CheckIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { updateCohortIndustryExpertsList } from "../../server/cohort/update";
import CreateModal from "@/modules/faculty/components/forms/create/modal";
import { getImageUrl } from "@/modules/common/lib/utils";

type SelectListProps = {
  isOpen?: boolean;
  cohortId: string;
  selectedFacultyList?: GetOneOutput[];
  trigger?: React.ReactNode;
};

export default function SelectList({
  isOpen,
  cohortId,
  selectedFacultyList,
  trigger,
}: SelectListProps) {
  const [open, setOpen] = useState(isOpen ?? false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [dataList, setDataList] = useState<GetOneOutput[]>([]);
  const [selectedList, setSelectedList] = useState<GetOneOutput[]>(
    selectedFacultyList ?? []
  );

  const handleSaveDataList = async () => {
    try {
      await updateCohortIndustryExpertsList({
        cohortId: cohortId,
        dataToAdd: selectedList.map((f) => f.id),
        dataToRemove:
          selectedFacultyList
            ?.filter((f) => !selectedList.find((s) => s.id === f.id))
            .map((f) => f.id) ?? [],
      });

      toast.success("Industry Experts list saved");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save Industry Experts list");
    }
  };

  useEffect(() => {
    const fetchDataList = async () => {
      const dataList = await getDataList();
      setDataList(dataList);
    };
    fetchDataList();
    return () => {
      setCreateModalOpen(false);
      setOpen(false);
    };
  }, []);

  return (
    <div>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <div onClick={() => setOpen(true)}>
          <PlusIcon className="size-5" />
        </div>
      )}
      <CommandDialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            setCreateModalOpen(false);
            setOpen(false);
          }
        }}
      >
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {dataList.map((data, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  if (selectedList.find((f) => f.id === data.id)) {
                    setSelectedList(
                      selectedList.filter((f) => f.id !== data.id)
                    );
                  } else {
                    setSelectedList([...selectedList, data]);
                  }
                }}
                keywords={[data.name]}
                className="justify-between"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="border">
                    {data.profile_image && (
                      <AvatarImage
                        src={getImageUrl(data.profile_image)}
                        alt={data.name}
                      />
                    )}
                    <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{data.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {data.title}
                    </p>
                  </div>
                </div>
                {selectedList.find((f) => f.id === data.id) && (
                  <CheckIcon className="size-4" />
                )}
              </CommandItem>
            ))}
          </CommandList>
          <div className="flex justify-end w-full p-5 gap-2">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveDataList}>Save</Button>
            </div>
          </div>
        </Command>
      </CommandDialog>
      <CreateModal
        setOpen={setCreateModalOpen}
        open={createModalOpen}
        noTrigger
      />
    </div>
  );
}
