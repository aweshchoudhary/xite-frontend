"use client";
import { Button } from "@ui/button";
import { deleteAction } from "./action";
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
} from "@ui/alert-dialog";

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
      success: "SubTopic deleted",
      error: "SubTopic deletion failed",
    });
  };

  const deleteActionHandler = async (recordId: string) => {
    await deleteAction(recordId);
    setIsOpen(false);
    if (onSuccess) onSuccess();
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {!noTrigger && (
        <AlertDialogTrigger asChild>
          {trigger ? trigger : <Button>Delete SubTopic</Button>}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this SubTopic, Sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible.
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

