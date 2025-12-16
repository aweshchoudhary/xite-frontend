"use client";
import { Button } from "@ui/button";
import { updateStatusAction } from "./action";
import { toast } from "sonner";
import { GetOne } from "@/modules/program/server/read";

export default function UpdateStatusBtn({ program }: { program: GetOne }) {
  const handleUpdateStatus = async () => {
    const { id, name } = program;

    if (program.status === "ACTIVE") {
      toast.error("Program is already active");
      return;
    }

    if (!id || !name) {
      toast.error("Program details are not complete!", {
        description: "Name is required",
      });
      return;
    }

    toast.promise(updateStatusAction(id), {
      loading: "Updating status...",
      success: "Program is now active",
      error: "Failed to update status",
    });
  };

  return (
    <Button type="button" onClick={handleUpdateStatus} variant="success">
      Make Active
    </Button>
  );
}
