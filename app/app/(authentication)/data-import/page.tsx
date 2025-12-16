"use client";
import { Button } from "@ui/button";
import { handleUpdateMediaUrls, handleUpdateSectionPositions } from "./action";
// // import { main } from "@/modules/common/database/prisma/seed/data-import";
// import { toast } from "sonner";

export default function DataImportPage() {
  // const handleImport = async () => {
  //   await main();
  //   toast.success("Data imported successfully");
  // };
  return (
    <div>
      {/* <Button onClick={handleImport}>Import Data</Button> */}
      <Button onClick={handleUpdateSectionPositions}>
        Update Section Positions
      </Button>
      <Button onClick={handleUpdateMediaUrls}>Update Media URLs</Button>
    </div>
  );
}
