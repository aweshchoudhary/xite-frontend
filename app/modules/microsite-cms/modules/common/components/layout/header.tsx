"use client";
import { LogOutIcon } from "lucide-react";
import { Button } from "../../ui/button";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState<string>(
    pathname.startsWith("/cms?tab=templates") ? "templates" : "microsites"
  );
  return (
    <header className="flex items-center justify-between py-4 px-10 border-b">
      <h2 className="text-lg font-bold">XITE Microsite Builder</h2>

      <div className="flex items-center gap-8">
        <Link
          className={cn(
            currentPage === "templates"
              ? "text-primary underline"
              : "text-muted-foreground"
          )}
          href="/cms?tab=templates"
          onClick={() => setCurrentPage("templates")}
        >
          Templates
        </Link>
        <Link
          className={cn(
            currentPage === "microsites"
              ? "text-primary underline"
              : "text-muted-foreground"
          )}
          href="/cms?tab=microsite-cms"
          onClick={() => setCurrentPage("microsite-cms")}
        >
          Microsites
        </Link>
      </div>

      <div>
        <Button>
          <LogOutIcon className="size-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
