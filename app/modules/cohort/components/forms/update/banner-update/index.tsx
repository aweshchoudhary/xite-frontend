"use client";

import { Input } from "@ui/input";
import { updateBannerAction } from "../action";
import { toast } from "sonner";

export default function BannerUpdate({ cohortId }: { cohortId: string }) {
  const handleChangeBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 6 * 1024 * 1024) {
          toast.error("File size must be less than 6MB");
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
        id="banner"
        type="file"
        onChange={handleChangeBanner}
        accept="image/*"
      />
    </div>
  );
}
