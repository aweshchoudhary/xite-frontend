"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/common/components/ui/tabs";
import { cn } from "@/modules/common/lib/utils";
import { buttonVariants } from "@/modules/common/components/ui/button";
import { Plus } from "lucide-react";
import Templates from "@/modules/microsite-cms/modules/template/screens/list";
import Link from "next/link";
import Microsites from "@/modules/microsite-cms/modules/microsite/screens/list";

export default function TabsContainer({ tab = "templates" }: { tab: string }) {
  const [currentTab, setCurrentTab] = useState<string>(tab);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <div>
      <Tabs defaultValue={currentTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="microsites">Microsites</TabsTrigger>
          </TabsList>
          <div className="shrink-0">
            {currentTab === "templates" && (
              <Link
                className={cn(buttonVariants({ variant: "outline" }))}
                href="/templates/new"
              >
                <Plus /> Template
              </Link>
            )}
            {currentTab === "microsites" && (
              <Link
                className={cn(buttonVariants({ variant: "outline" }))}
                href="/microsites/new"
              >
                <Plus /> Microsite
              </Link>
            )}
          </div>
        </div>
        <TabsContent value="templates">
          <div>
            <Templates />
          </div>
        </TabsContent>
        <TabsContent value="microsites">
          <div>
            <Microsites />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
