"use client";

import { Input } from "@ui/input";
import { updateProfileImage } from "./actions";
import { toast } from "sonner";

export default function ProfileImageUpdate({
  facultyId,
}: {
  facultyId: string;
}) {
  const handleUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 3 * 1024 * 1024) {
          toast.error("File size must be less than 3MB");
          return;
        }
        await updateProfileImage(facultyId, file);
        toast.success("Profile image updated");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile image");
    }
  };

  return (
    <div>
      <Input
        className="sr-only"
        id="profile-image"
        type="file"
        onChange={handleUpdate}
        accept="image/*"
        max={3 * 1024 * 1024}
        multiple={false}
      />
    </div>
  );
}
