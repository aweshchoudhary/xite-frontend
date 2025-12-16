"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import FacultyCard from "../faculty-card";
import { Button } from "@ui/button";
import { Move, Plus, Trash } from "lucide-react";
import { removeFacultyItemFromSection } from "./action";
import { toast } from "sonner";
import FacultySelectPopover from "./faculty-select-popover";

interface Item {
  id: number;
  position: number;
  name: string;
  profile_image: string;
  description: string;
  itemId: string;
  sectionId: string;
}

interface SortableItemProps {
  item: Item;
  selectedFacultyIds: string[];
}

export function SortableItem({ item, selectedFacultyIds }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 0,
  };

  const handleRemove = async () => {
    toast.promise(removeFacultyItemFromSection({ itemId: item.itemId }), {
      loading: "Removing faculty item...",
      success: "Faculty item removed",
      error: "Failed to remove faculty item",
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab relative"
    >
      <FacultyCard
        profile_image={item.profile_image}
        name={item.name}
        description={item.description}
      />
      {!isDragging && (
        <div className="mt-2">
          <Button
            onClick={handleRemove}
            variant="outline"
            className="text-destructive"
            size="sm"
          >
            <Trash className="size-4" /> Remove
          </Button>
        </div>
      )}
      <div className="absolute top-0 right-0">
        <Button variant="secondary" size="icon">
          <Move className="size-4" />
        </Button>
      </div>

      {!isDragging && (
        <div className="absolute top-1/2 z-20 h-full flex items-center flex-col -translate-y-1/2 -right-8">
          <div className="w-0.5 flex-1 bg-gray-100 rounded-full"></div>
          <FacultySelectPopover
            sectionId={item.sectionId}
            position={item.position + 1}
            selectedFacultyIds={selectedFacultyIds}
          >
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full size-7!"
            >
              <Plus className="size-4" />
            </Button>
          </FacultySelectPopover>
          <div className="w-0.5 flex-1 bg-gray-100 rounded-full"></div>
        </div>
      )}
    </div>
  );
}
