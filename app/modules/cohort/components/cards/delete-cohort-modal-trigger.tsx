"use client";
import { Button } from "@ui/button";
import { TrashIcon } from "lucide-react";
import DeleteCohortModal from "../forms/delete/modal";
import { useState } from "react";

type DeleteCohortModalTriggerProps = {
  cohortId: string;
};

export default function DeleteCohortModalTrigger({
  cohortId,
}: DeleteCohortModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DeleteCohortModal
      recordId={cohortId}
      trigger={
        <Button variant="destructive" size="icon">
          <TrashIcon className="size-4" />
        </Button>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSuccess={() => {
        setIsOpen(false);
      }}
      onCancel={() => {
        setIsOpen(false);
      }}
    />
  );
}
