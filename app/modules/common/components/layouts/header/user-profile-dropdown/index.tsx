"use client";
import { LogOut } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/modules/common/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";
import { getImageUrl } from "@/modules/common/lib/utils";
import { useAuth } from "@/modules/common/authentication/firebase/use-auth-hook";

export default function UserProfileDropdown() {
  return <UserProfileDropdownMenu />;
}

export const UserProfileAvatar = () => {
  const session = useAuth();
  return (
    <div>
      <Avatar>
        {session.user?.photoURL && (
          <AvatarImage src={getImageUrl(session.user?.photoURL)} />
        )}
        <AvatarFallback>
          {session.user?.displayName?.split(" ")[0]?.charAt(0)}
          {session.user?.displayName?.split(" ")[1]?.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

const UserProfileDropdownMenu = () => {
  const session = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserProfileAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div>
            <h3 className="text-base font-semibold capitalize">
              {session.user?.displayName}
            </h3>
            <p className="mb-2">{session.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem className="bg-destructive/5" variant="destructive">
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
