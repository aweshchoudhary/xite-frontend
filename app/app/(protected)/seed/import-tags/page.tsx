"use client";
import { toast } from "sonner";
import { seedProgramTags } from "./action";

export default function ImportTagsPage() {
  const handleImportTags = async () => {
    try {
      await seedProgramTags();
      toast.success("Tags imported successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to import tags");
    }
  };
  return (
    <div>
      <button onClick={handleImportTags}>Import Tags</button>
    </div>
  );
}