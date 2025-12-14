"use client";

import { Plus, Settings } from "lucide-react";
import { Button, buttonVariants } from "../../ui/button";
import UserProfileDropdown from "../../ui/user-profile-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import Link from "next/link";
import { links } from "../sidebar/links";
import { cn } from "@/modules/common/lib/utils";
import MainBanner from "@/modules/dashboard/components/banners/main-banner";

export default function PageHeader() {
  return (
    <div className="flex px-5 py-3 items-center justify-between 2xl:gap-20 xl:gap-16 lg:gap-12 md:gap-10 gap-5">
      <div className="w-[60%]">
        <MainBanner />
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/settings"
          className={cn(buttonVariants({ size: "iconSm", variant: "outline" }))}
        >
          <Settings />
        </Link>
        <UserProfileDropdown />
      </div>
    </div>
  );
}
const CreateDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outlineAccent" size="sm">
          <Plus className="size-5" /> New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {links.map((link) => (
          <DropdownMenuItem asChild key={link.title}>
            <Link className="flex items-center gap-2" href={`${link.url}/new`}>
              <link.icon className="h-4 w-4" /> <span>{link.title}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
