"use client";
import { Button } from "@/modules/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/common/components/ui/dialog";
import { useFormState } from "./context";
import { useEffect } from "react";
import UpdateForm from "./form";
import { UpdateSchema } from "../schema";
import { FormUpdateModalBaseProps } from "@/modules/common/components/global/form/types/form-props";

interface UpdateFormProps extends FormUpdateModalBaseProps<UpdateSchema> {}

export default function UpdateModal({
  noTrigger = false,
  trigger,
  currentData,
  successRedirectPath,
  cancelRedirectPath,
  open,
  setOpen,
}: UpdateFormProps) {
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
          successRedirectPath={successRedirectPath}
          cancelRedirectPath={cancelRedirectPath}
        />
      </DialogContent>
    </Dialog>
  );
}
