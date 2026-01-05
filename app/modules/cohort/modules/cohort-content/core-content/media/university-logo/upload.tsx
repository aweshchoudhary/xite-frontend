"use client";

import { Input } from "@ui/input";
import { updateUniversityLogoAction } from "./server/action";
import { toast } from "sonner";

export default function BannerUpdate({
  cohortId,
  fieldName,
}: {
  cohortId: string;
  fieldName?: string;
}) {
  const handleChangeLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File size must be less than 10MB");
          return;
        }

        toast.promise(updateUniversityLogoAction(cohortId, file), {
          loading: "Updating logo...",
          success: "Logo updated successfully",
          error: "Failed to update logo",
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
        id={fieldName || "university-logo-image"}
        type="file"
        onChange={handleChangeLogo}
        accept="image/*"
      />
    </div>
  );
}
