"use client";
import Link from "next/link";
import { links } from "../../global/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/modules/common/lib/utils";
import { hasPermission } from "@/modules/common/authentication/access-control/lib/check-permission";
import { useAuth } from "@/modules/common/authentication/firebase/use-auth-hook";
import { useMemo } from "react";

export default function MobileNavigation() {
  const pathname = usePathname();
  const { roles } = useAuth();

  // Filter links based on permissions once, using useMemo to prevent recalculation
  const filteredLinks = useMemo(() => {
    return links.filter((link) => hasPermission(roles, link.resource, "read"));
  }, [roles]);

  const isActive = (url: string, exact: boolean = false) => {
    if (exact) {
      return pathname === url;
    }
    return pathname.startsWith(url);
  };

  return (
    <div className="flex items-center justify-center px-5 bg-primary text-primary-foreground">
      <ul className="flex items-center flex-wrap justify-center gap-4 py-3">
        {filteredLinks.map((link) => (
          <li key={link.url}>
            <Link
              className={cn(
                "px-3 py-1.5 rounded-md",
                isActive(link.url, link.exact) &&
                  "bg-primary-foreground text-foreground"
              )}
              href={link.url}
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
