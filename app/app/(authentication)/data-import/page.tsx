"use client";

import { Button } from "@/modules/common/components/ui/button";
import { main } from "@/modules/topic/server/import";
import { toast } from "sonner";

export default function DataImportPage() {
  const handleImportTopics = async () => {
    try {
      await main();
      toast.success("Topics imported successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error importing topics");
    }
  };
  return (
    <div>
      <Button onClick={handleImportTopics}>Import Topics</Button>
    </div>
  );
}
