"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./sortable-item";

type Props = {
  facultyIds: string[];
  onRemove: (facultyId: string) => void;
  onReorder: (reorderedIds: string[]) => void;
};

/**
 * A grid that allows sorting faculty items via drag-and-drop.
 */
export function SortableGrid({ facultyIds, onRemove, onReorder }: Props) {
  const [items, setItems] = useState(facultyIds);

  useEffect(() => {
    setItems(facultyIds);
  }, [facultyIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((id) => id === active.id);
      const newIndex = items.findIndex((id) => id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);

      setItems(newOrder);
      onReorder(newOrder);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {items.map((facultyId) => (
            <SortableItem
              key={facultyId}
              facultyId={facultyId}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
