"use client";
import Link from "next/link";
import { links } from "../../global/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/modules/common/lib/utils";
import { useHasPermission } from "@/modules/common/authentication/access-control/lib";
import { Link as LinkType } from "../../global/sidebar/links";

export default function MobileNavigation() {
  return (
    <div className="flex items-center justify-center px-5 border-b border-sidebar-border">
      <ul className="flex items-center gap-4 py-3">
        {links.map((link) => (
          <LinkItem key={link.url} link={link} />
        ))}
      </ul>
    </div>
  );
}

const LinkItem = ({ link }: { link: LinkType }) => {
  const pathname = usePathname();
  const isActive = (url: string, exact: boolean = false) => {
    if (exact) {
      return pathname === url;
    }
    return pathname.startsWith(url);
  };
  const hasPermission = useHasPermission(link.resource, "read");
  if (hasPermission)
    return (
      <li key={link.url}>
        <Link
          className={cn(
            "px-3 py-1.5 rounded-md",
            isActive(link.url, link.exact) &&
              "bg-sidebar-accent border-sidebar-border border"
          )}
          href={link.url}
        >
          {link.title}
        </Link>
      </li>
    );
};
