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
import CreateProgramForm from "./form";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import { FormModalBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { ProgramCreateSchema } from "@/modules/program/components/forms/schema";

interface FormModalProps extends FormModalBaseProps<ProgramCreateSchema> {}

export default function CreateProgramModal({
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
            <Button size={"sm"}>
              <Plus className="size-5" /> Program
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Program</DialogTitle>
        </DialogHeader>
        <CreateProgramForm
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
