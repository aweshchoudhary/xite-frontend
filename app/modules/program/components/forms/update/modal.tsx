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
import { FormUpdateModalBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { ProgramUpdateSchema } from "../schema";

interface FormModalProps
  extends FormUpdateModalBaseProps<ProgramUpdateSchema> {}

export default function UpdateProgramModal({
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
          {trigger ? trigger : <Button>Update Program</Button>}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Program</DialogTitle>
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
