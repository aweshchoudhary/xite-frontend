"use client";

import { Input } from "@/modules/common/components/ui/input";
import { updateAcademyLogo } from "./actions";
import { toast } from "sonner";

export default function AcademyLogoUpdate({
  academyId,
}: {
  academyId: string;
}) {
  const handleChangeBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 3 * 1024 * 1024) {
          toast.error("File size must be less than 3MB");
          return;
        }
        updateAcademyLogo(academyId, file);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update academy logo");
    }
  };

  return (
    <div>
      <Input
        className="sr-only"
        id="academy-logo"
        type="file"
        onChange={handleChangeBanner}
        accept=".jpg, .jpeg, .png, .webp"
      />
    </div>
  );
}
