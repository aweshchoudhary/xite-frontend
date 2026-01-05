import Image from "next/image";
import UserProfileDropdown from "../../ui/user-profile-dropdown";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

export default function TopBar() {
  return (
    <div className="border-b border-sidebar-border px-8 py-3 flex items-center justify-between">
      <div>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            className="w-20"
            width={100}
            height={100}
          />
        </Link>
      </div>
      <div>
        <h2 className="text-lg font-semibold">
          XED Integrated Transformation Engine
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/settings"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={Settings01Icon} className="size-5" />
        </Link>
        <UserProfileDropdown />
      </div>
    </div>
  );
}
