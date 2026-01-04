"use client";

import { Input } from "@ui/input";
import { updateUniversityLogoAction } from "./server/action";
import { toast } from "sonner";

export default function UniversityLogoUpdate({
  cohortId,
  fieldName,
}: {
  cohortId: string;
  fieldName?: string;
}) {
  const handleChangeBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File size must be less than 10MB");
          return;
        }

        toast.promise(updateUniversityLogoAction(cohortId, file), {
          loading: "Updating university logo...",
          success: "University logo updated successfully",
          error: "Failed to update university logo",
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
        id={fieldName || "banner-image"}
        type="file"
        onChange={handleChangeBanner}
        accept="image/*"
      />
    </div>
  );
}
