"use client";

import { Input } from "@/modules/common/components/ui/input";
import { updateBrochureAction } from "../action";
import { toast } from "sonner";

export default function BrochureUpdate({ cohortId }: { cohortId: string }) {
  const handleChangeBrochure = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          error: "Failed to update brochure",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Input
        className="sr-only w-20"
        id="brochure"
        type="file"
        onChange={handleChangeBrochure}
        accept=".pdf"
      />
    </div>
  );
}
