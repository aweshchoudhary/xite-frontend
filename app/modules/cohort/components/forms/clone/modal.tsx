"use client";
import { Button } from "@ui/button";
import { cloneCohortAction } from "./action";
import { MODULE_NAME } from "@/modules/cohort/contants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/alert-dialog";
import { useTransition } from "react";

type CloneModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  recordId: string;
  cohortName?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function CloneModal({
  isOpen,
  setIsOpen,
  recordId,
  cohortName,
  onSuccess,
  onCancel,
}: CloneModalProps) {
  const router = useRouter();
  const [isCloning, startCloneTransition] = useTransition();

  const handleClone = () => {
    startCloneTransition(async () => {
      try {
        const result = await cloneCohortAction(recordId);
        if (result.error) {
          toast.error(result.error);
        } else if (result.data) {
          toast.success(`${MODULE_NAME} cloned successfully`);
          setIsOpen(false);
          if (onSuccess) onSuccess();
          else router.refresh();
        }
      } catch (error) {
        toast.error(`Failed to clone ${MODULE_NAME}`);
      }
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clone this {MODULE_NAME}?</AlertDialogTitle>
          <AlertDialogDescription>
            {cohortName
              ? `This will create a copy of "${cohortName}" with all its sections and data. The cloned ${MODULE_NAME} will be created as a draft.`
              : `This will create a copy of this ${MODULE_NAME} with all its sections and data. The cloned ${MODULE_NAME} will be created as a draft.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              onClick={handleCancel}
              type="button"
              variant="outline"
              disabled={isCloning}
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handleClone}
              type="button"
              disabled={isCloning}
            >
              {isCloning ? "Cloning..." : "Clone"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

