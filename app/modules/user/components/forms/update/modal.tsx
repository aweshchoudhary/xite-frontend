"use client";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { useFormState } from "./context";
import UpdateForm from "./form";
import { useEffect } from "react";
import { Pencil } from "lucide-react";
import { MODULE_NAME } from "@/modules/user/contants";
import { UpdateSchema } from "@/modules/user/components/forms/schema";
import { FormModalBaseProps } from "@/modules/common/components/global/form/types/form-props";

interface FormModalProps extends FormModalBaseProps<UpdateSchema> {}

export default function UpdateModal({
  noTrigger = false,
  trigger,
  open = false,
  setOpen,
  defaultValues,
  onSuccess,
  onCancel,
  successRedirectPath,
  cancelRedirectPath,
}: FormModalProps) {
  const { isModalOpen, openModal } = useFormState();

  useEffect(() => {
    if (open) {
      openModal();
    }
  }, [open, openModal]);

  useEffect(() => {
    if (isModalOpen) {
      setOpen?.(true);
    } else {
      setOpen?.(false);
    }
  }, [isModalOpen, setOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={openModal}>
      {!noTrigger && (
        <DialogTrigger asChild>
          {trigger ? (
            trigger
          ) : (
            <Button variant="outline">
              <Pencil className="size-5" /> Edit {MODULE_NAME}
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update {MODULE_NAME}</DialogTitle>
        </DialogHeader>
        <UpdateForm
          defaultValues={defaultValues}
          onSuccess={onSuccess}
          onCancel={onCancel}
          successRedirectPath={successRedirectPath}
          cancelRedirectPath={cancelRedirectPath}
        />
      </DialogContent>
    </Dialog>
  );
}
