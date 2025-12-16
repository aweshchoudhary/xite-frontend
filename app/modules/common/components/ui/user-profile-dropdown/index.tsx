"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { useAuth } from "@/modules/common/authentication/firebase/use-auth-hook";
import { logoutAction } from "@/modules/common/authentication/firebase/action";

export default function UserProfileDropdown() {
  return <UserProfileDropdownMenu />;
}

export const UserProfileAvatar = () => {
  const { user } = useAuth();
  return (
    <div>
      <Avatar className="size-8">
        {user?.photoURL && <AvatarImage src={user?.photoURL} />}
        <AvatarFallback className="text-sm">
          {user?.displayName?.split(" ")[0]?.charAt(0)}
          {user?.displayName?.split(" ")[1]?.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

const UserProfileDropdownMenu = () => {
  const { user } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserProfileAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-fit">
        <DropdownMenuLabel>
          <div>
            <h3 className="text-base font-semibold capitalize">
              {user?.displayName}
            </h3>
            <p className="mb-2">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => logoutAction()}
          className="bg-destructive/5"
          variant="destructive"
        >
          <HugeiconsIcon icon={Logout01Icon} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
