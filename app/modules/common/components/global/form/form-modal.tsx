"use client";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { useEffect } from "react";
import { Plus } from "lucide-react";

type FormModalProps = {
  trigger?: React.ReactNode;
  noTrigger?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  form: React.ReactNode;
  title: string;
  useFormState: () => FormModalState;
};

type FormModalState = {
  isModalOpen: boolean;
  openModal: ((open: boolean) => void) | (() => void);
};

export default function CreateModal({
  noTrigger = false,
  trigger,
  open = false,
  setOpen,
  title,
  form,
  useFormState,
}: FormModalProps) {
  const { isModalOpen, openModal } = useFormState();

  useEffect(() => {
    if (open) {
      if (openModal.length === 0) {
        (openModal as () => void)();
      } else {
        (openModal as (open: boolean) => void)(true);
      }
    }
  }, [open, openModal]);

  useEffect(() => {
    setOpen?.(isModalOpen);
  }, [isModalOpen, setOpen]);

  const handleOpenChange = (next: boolean) => {
    if (openModal.length === 0) {
      (openModal as () => void)();
    } else {
      (openModal as (open: boolean) => void)(next);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      {!noTrigger && (
        <DialogTrigger asChild>
          {trigger ? (
            trigger
          ) : (
            <Button>
              <Plus className="size-5" /> {title}
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}
