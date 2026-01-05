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
} from "@ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { getFacultyList } from "./actions";
import { Button } from "@ui/button";
import { CheckIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { updateCohortFacultyList } from "../../server/cohort/update";
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
  selectedFacultyList = [],
  trigger,
}: SelectListProps) {
  const [open, setOpen] = useState(isOpen ?? false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [facultyList, setFacultyList] = useState<GetOneOutput[]>([]);
  const [selectedList, setSelectedList] =
    useState<GetOneOutput[]>(selectedFacultyList);

  const handleSaveFacultyList = async () => {
    try {
      await updateCohortFacultyList({
        cohortId,
        facultyToAdd: selectedList.map((f) => f.id),
        facultyToRemove: selectedFacultyList
          .filter((f) => !selectedList.find((s) => s.id === f.id))
          .map((f) => f.id),
      });

      toast.success("Faculty list saved");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save faculty list");
    }
  };

  useEffect(() => {
    const fetchFacultyList = async () => {
      try {
        const list = await getFacultyList();
        setFacultyList(list);
      } catch (error) {
        console.error("Failed to fetch faculty list", error);
      }
    };

    fetchFacultyList();
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
          }
          setOpen(open);
        }}
      >
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search faculty by name..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {facultyList.map((faculty) => (
              <CommandItem
                key={faculty.id}
                onSelect={() => {
                  if (selectedList.some((f) => f.id === faculty.id)) {
                    setSelectedList(
                      selectedList.filter((f) => f.id !== faculty.id)
                    );
                  } else {
                    setSelectedList([...selectedList, faculty]);
                  }
                }}
                keywords={[faculty.name]}
                className="justify-between"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="border">
                    {faculty.profile_image ? (
                      <AvatarImage
                        src={getImageUrl(faculty.profile_image)}
                        alt={faculty.name || "Faculty"}
                      />
                    ) : null}
                    <AvatarFallback>
                      {faculty.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{faculty.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {faculty.title}
                    </p>
                  </div>
                </div>
                {selectedList.some((f) => f.id === faculty.id) && (
                  <CheckIcon className="size-4" />
                )}
              </CommandItem>
            ))}
          </CommandList>
          <div className="flex justify-end w-full p-5 gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFacultyList}>Save</Button>
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
