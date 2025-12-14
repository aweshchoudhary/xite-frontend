"use client";
import { Button } from "@/modules/common/components/ui/button";
import { deleteCohortAction as deleteAction } from "./action";
import { MODULE_NAME, MODULE_PATH } from "@/modules/cohort/contants";
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
  AlertDialogTrigger,
} from "@/modules/common/components/ui/alert-dialog";

type FormModalProps = {
  trigger?: React.ReactNode;
  noTrigger?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  recordId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function DeleteModal({
  noTrigger = false,
  trigger,
  isOpen,
  setIsOpen,
  recordId,
  onSuccess,
  onCancel,
}: FormModalProps) {
  const router = useRouter();

  const handleDelete = async () => {
    toast.promise(deleteActionHandler(recordId), {
      loading: "Deleting...",
      success: `${MODULE_NAME} deleted`,
      error: `${MODULE_NAME} deletion failed`,
    });
  };

  const deleteActionHandler = async (recordId: string) => {
    await deleteAction(recordId);
    setIsOpen(false);
    if (onSuccess) onSuccess();
    else router.push(MODULE_PATH);
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {!noTrigger && (
        <AlertDialogTrigger asChild>
          {trigger ? trigger : <Button>Delete {MODULE_NAME}</Button>}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this {MODULE_NAME}, Sure?</AlertDialogTitle>
          <AlertDialogDescription>
            All related items will be deleted. This action is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button onClick={handleCancel} type="button" variant="outline">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDelete} type="button">
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
