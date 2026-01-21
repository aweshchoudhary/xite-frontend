"use client";

import { Tabs, TabsList, TabsTrigger } from "@ui/tabs";
import { ProgramType } from "@/modules/common/database/prisma/generated/prisma";
import { useRouter, useSearchParams } from "next/navigation";
import { enumDisplay } from "@/modules/common/lib/enum-display";

interface ProgramTypeTabsProps {
  currentType?: ProgramType;
}

export default function ProgramTypeTabs({ currentType }: ProgramTypeTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "ALL") {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    
    // Keep the status parameter if it exists
    const query = params.toString();
    router.push(`/programs${query ? `?${query}` : ""}`);
  };

  const types: (ProgramType | "ALL")[] = [
    "ALL",
    ...Object.values(ProgramType),
  ];

  return (
    <Tabs
      value={currentType || "ALL"}
      onValueChange={handleTypeChange}
      className="w-full"
    >
      <TabsList variant="line">
        {types.map((type) => (
          <TabsTrigger key={type} value={type} className="capitalize">
            {enumDisplay(type)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
