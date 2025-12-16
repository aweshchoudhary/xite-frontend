"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon } from "@hugeicons/core-free-icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ui/sidebar";
import Link from "next/link";
import PermissionGate from "@/modules/common/authentication/access-control/components/permission-gate";
import { links } from "./links";
import { usePathname } from "next/navigation";
import ThemeSwitch from "../theme-switch";
import Image from "next/image";

export default function AppSidebar() {
  const pathname = usePathname();
  const isActive = (url: string, exact: boolean = false) => {
    if (exact) {
      return pathname === url;
    }
    return pathname.startsWith(url);
  };
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="logo"
            className="w-25 dark:brightness-150 dark:contrast-125"
            width={100}
            height={100}
            priority
            quality={90}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={isActive("/", true)} asChild>
                  <Link className="text-base!" href="/">
                    <HugeiconsIcon icon={Home01Icon} className="size-5!" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {links.map((item) => (
                <PermissionGate
                  key={item.title}
                  resource={item.resource}
                  action="read"
                >
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link className="text-base!" href={item.url}>
                        <HugeiconsIcon icon={item.icon} className="size-5!" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </PermissionGate>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeSwitch />
      </SidebarFooter>
    </Sidebar>
  );
}
