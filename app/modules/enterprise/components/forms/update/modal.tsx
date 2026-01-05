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
import { useEffect } from "react";
import UpdateForm from "./form";
import { MODULE_NAME } from "@/modules/enterprise/contants";
import { UpdateSchema } from "../schema";
import { FormUpdateModalBaseProps } from "@/modules/common/components/global/form/types/form-props";

interface FormModalProps extends FormUpdateModalBaseProps<UpdateSchema> {}

export default function UpdateModal({
  noTrigger = false,
  trigger,
  open = false,
  setOpen,
  currentData,
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
          {trigger ? trigger : <Button>Update {MODULE_NAME}</Button>}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {MODULE_NAME}</DialogTitle>
        </DialogHeader>
        <UpdateForm
          currentData={currentData}
          onSuccess={onSuccess}
          onCancel={onCancel}
          successRedirectPath={successRedirectPath}
          cancelRedirectPath={cancelRedirectPath}
        />
      </DialogContent>
    </Dialog>
  );
}
