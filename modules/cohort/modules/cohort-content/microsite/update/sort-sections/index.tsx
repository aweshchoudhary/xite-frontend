"use client";
import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronsUpDown } from "lucide-react";
import { CohortSectionType } from "@/modules/common/database";

function SortableItem({
  id,
  section_title,
  section_position,
  section_type,
  section_data,
}: {
  id: string;
  section_title: string;
  section_position: number;
  section_type: CohortSectionType;
  section_data: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between px-3 py-2 rounded-lg shadow-sm border select-none cursor-grab
        ${
          isDragging
            ? "bg-white/90 ring-2 ring-offset-2 ring-indigo-300"
            : "bg-white"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <ChevronsUpDown className="size-4" />

        <span className="font-medium text-sm">{section_position}</span>
        <span className="font-medium text-sm">{section_title}</span>
      </div>
    </li>
  );
}

export default function DraggableList({
  items: initialItems,
  onReorder,
}: {
  items: any[];
  onReorder: (items: any[]) => void;
}) {
  const [items, setItems] = useState(initialItems || []);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);

      // update position values
      const reordered = newOrder.map((item, index) => ({
        ...item,
        section_position: index + 1,
      }));

      setItems(reordered);

      if (onReorder && typeof onReorder === "function") {
        try {
          await onReorder(reordered);
        } catch (err) {
          console.error("Error calling onReorder:", err);
        }
      }
    }
  }

  return (
    <div className="max-w-md">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i: any) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <h3 className="mb-3">Sections Order</h3>
          <ul className="space-y-2">
            {items
              .sort((a, b) => a.section_position - b.section_position)
              .map((item: any) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  section_title={item.section_title}
                  section_position={item.section_position}
                  section_type={item.section_type}
                  section_data={item.section_data}
                />
              ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
