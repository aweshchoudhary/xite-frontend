"use client";

import { useState } from "react";
import TitleUpdateForm from "./update";
import { Pencil } from "lucide-react";
import { Label } from "@ui/label";

export default function Title({
  title,
  sectionId,
  onSuccess,
  onCancel,
  defaultIsEditing,
}: {
  title: string;
  sectionId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultIsEditing?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(defaultIsEditing || false);

  return (
    <div>
      {isEditing ? (
        <TitleUpdateForm
          defaultValues={{ title, id: sectionId }}
          onSuccess={() => {
            setIsEditing(false);
            onSuccess?.();
          }}
          onCancel={() => {
            setIsEditing(false);
          }}
        />
      ) : (
        <div className="mb-5">
          <Label>Section Title</Label>
          <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            {title}{" "}
            <Pencil
              className="size-4 cursor-pointer"
              onClick={() => setIsEditing(true)}
            />
          </h3>
        </div>
      )}
    </div>
  );
}
