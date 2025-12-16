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
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@ui/dialog";
import { GetAllOutput, GetOne, getAll } from "@/modules/user/server/read";
import { assignUserToCohort } from "./action";
type Props = {
  children?: React.ReactNode;
  cohortId: string;
  selectedUserId?: string;
};

export default function UserSelectPopover({
  children,
  cohortId,
  selectedUserId,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selectedUserId);
  const [showList, setShowList] = React.useState(false);
  const [users, setUsers] = React.useState<GetAllOutput["data"]>([]);
  const [selectedUser, setSelectedUser] = React.useState<GetOne | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleSelect = async (currentValue: string) => {
    try {
      toast.promise(
        assignUserToCohort({
          userId: currentValue,
          cohortId: cohortId,
        }),
        {
          loading: "Adding user to section...",
          success: "User added to section",
          error: "Failed to add user to section",
        }
      );
      setOpen(false);
    } catch (error) {
      toast.error("Failed to select user");
    }
  };

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAll();
        setUsers(
          users.data?.filter((user) => user.id !== selectedUserId) || []
        );
        setSelectedUser(
          users.data?.find((user) => user.id === selectedUserId) || null
        );
      } catch (error) {
        console.error(error);
      }
    };
    setShowList(false);
    fetchUsers();
  }, [selectedUserId]);

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
            className="w-fit justify-between capitalize"
          >
            {value ? selectedUser?.name : "Assign User"}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-fit p-3 shadow">
        <Command>
          <CommandInput
            onValueChange={handleDeboucedValueChange}
            placeholder="Search User..."
          />
          {/* don't show list data initially only after the search value is changed */}
          {showList && (
            <CommandList ref={scrollRef}>
              <CommandEmpty>No User found.</CommandEmpty>
              <CommandGroup>
                {users?.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={(currentValue) => {
                      handleSelect(currentValue);
                      setValue(currentValue === value ? "" : currentValue);
                      setSelectedUser(item);
                    }}
                    keywords={[item.name || ""]}
                    className="capitalize"
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
                        src={getImageUrl(item.image)}
                      />
                      <AvatarFallback>{item.name?.charAt(0)}</AvatarFallback>
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
