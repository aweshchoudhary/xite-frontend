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
import CreateForm from "./form";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import { MODULE_NAME } from "@/modules/enterprise/contants";
import { FormModalBaseProps } from "@/modules/common/components/global/form/types/form-props";
import { CreateSchema } from "@/modules/enterprise/components/forms/schema";

interface FormModalProps extends FormModalBaseProps<CreateSchema> {}

export default function CreateModal({
  noTrigger = false,
  trigger,
  open = false,
  defaultValues,
  onSuccess,
  onCancel,
  successRedirectPath,
  cancelRedirectPath,
  setOpen,
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
