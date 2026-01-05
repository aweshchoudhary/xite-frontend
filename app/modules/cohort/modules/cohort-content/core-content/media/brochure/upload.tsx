"use client";

import { Input } from "@ui/input";
import { updateBrochureAction } from "./server/action";
import { toast } from "sonner";

export default function BrochureUpdate({
  cohortId,
  fieldName,
}: {
  cohortId: string;
  fieldName?: string;
}) {
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File size must be less than 10MB");
          return;
        }

        toast.promise(updateBrochureAction(cohortId, file), {
          loading: "Updating brochure...",
          success: "Brochure updated successfully",
          error: "Failed to upload brochure",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Input
        className="sr-only"
        id={fieldName || "brochure"}
        type="file"
        onChange={handleChangeFile}
        accept=".pdf"
      />
    </div>
  );
}
