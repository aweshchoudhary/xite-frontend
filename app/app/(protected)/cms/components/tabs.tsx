"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/common/components/ui/tabs";
import { cn } from "@/modules/common/lib/utils";
import { Button, buttonVariants } from "@/modules/common/components/ui/button";
import { Plus } from "lucide-react";
import Templates from "@/modules/microsite-cms/modules/template/screens/list";
import Link from "next/link";
import Microsites from "@/modules/microsite-cms/modules/microsite/screens/list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";

export default function TabsContainer({ tab = "templates" }: { tab: string }) {
  const [currentTab, setCurrentTab] = useState<string>(tab);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <div>
      <Tabs defaultValue={currentTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList className="gap-5 bg-transparent">
            <TabsTrigger
              value="templates"
              className="px-5! py-2! data-active:border-primary! text-base data-active:border-b-2 border-0 shadow-none! w-fit! h-fit!"
            >
              Templates
            </TabsTrigger>
            <TabsTrigger
              className="px-5! py-2! data-active:border-primary! text-base data-active:border-b-2 border-0 shadow-none! w-fit! h-fit!"
              value="microsites"
            >
              External Microsites
            </TabsTrigger>
          </TabsList>
          <div className="shrink-0">
            {currentTab === "templates" && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline">
                    <Plus /> Template
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-fit!">
                  <DropdownMenuItem asChild>
                    <Link href="/templates/new?type=generic">Generic</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/templates/new?type=program-specific">
                      Program-Specific
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {currentTab === "microsites" && (
              <Link
                className={cn(buttonVariants({ variant: "outline" }))}
                href="/microsites/new?type=generic"
              >
                <Plus /> External Microsite
              </Link>
            )}
          </div>
        </div>
        <TabsContent value="templates">
          <div className="pt-5">
            <Templates />
          </div>
        </TabsContent>
        <TabsContent value="microsites">
          <div className="pt-5">
            <Microsites />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
