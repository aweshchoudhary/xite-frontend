"use client";

import { Input } from "@/modules/common/components/ui/input";
import { updateBannerAction } from "./server/action";
import { toast } from "sonner";

export default function BannerUpdate({
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

        toast.promise(updateBannerAction(cohortId, file), {
          loading: "Updating banner...",
          success: "Banner updated successfully",
          error: "Failed to update banner",
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
