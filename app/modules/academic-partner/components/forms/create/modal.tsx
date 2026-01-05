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
import CreateForm from "./form";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import { MODULE_NAME } from "@/modules/academic-partner/contants";
import { CreateSchema } from "@/modules/faculty/components/forms/schema";
import { FormModalBaseProps } from "@/modules/common/components/global/form/types/form-props";

interface FormModalProps extends FormModalBaseProps<CreateSchema> {}

export default function CreateModal({
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
    setOpen?.(isModalOpen);
  }, [isModalOpen, setOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={openModal}>
      {!noTrigger && (
        <DialogTrigger asChild>
          {trigger ? (
            trigger
          ) : (
            <Button>
              <Plus className="size-5" /> {MODULE_NAME}
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create {MODULE_NAME}</DialogTitle>
        </DialogHeader>
        <CreateForm
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
