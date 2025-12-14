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
import CreateCohortForm from "./form";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import { CreateSchema } from "../schema";
import { FormModalBaseProps } from "@/modules/common/components/global/form/types/form-props";

interface CreateModalProps extends FormModalBaseProps<CreateSchema> {}

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
}: CreateModalProps) {
  const { isModalOpen, openModal } = useFormState();

  useEffect(() => {
    if (open) {
      openModal();
    }
  }, [open, openModal]);

  useEffect(() => {
    if (setOpen) {
      setOpen(isModalOpen);
    }
  }, [isModalOpen, setOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={openModal}>
      {!noTrigger && (
        <DialogTrigger asChild>
          {trigger ? (
            trigger
          ) : (
            <Button>
              <Plus className="size-5" /> Cohort
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Cohort</DialogTitle>
        </DialogHeader>
        <CreateCohortForm
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
