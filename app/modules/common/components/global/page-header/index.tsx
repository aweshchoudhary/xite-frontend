"use client";

import { cn } from "@/modules/common/lib/utils";
import MainBanner from "@/modules/dashboard/components/banners/main-banner";
import Link from "next/link";
import { buttonVariants } from "../../ui/button";
import { Settings } from "lucide-react";
import UserProfileDropdown from "../../ui/user-profile-dropdown";

export default function PageHeader() {
  return (
    <div className="flex px-5 py-3 items-center justify-between 2xl:gap-20 xl:gap-16 lg:gap-12 md:gap-10 gap-5">
      <div className="w-[60%]">
        <MainBanner />
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/settings"
          className={cn(buttonVariants({ size: "icon", variant: "outline" }))}
        >
          <Settings />
        </Link>
        <UserProfileDropdown />
      </div>
    </div>
  );
}
