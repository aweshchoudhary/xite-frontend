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

type FacultyItem = {
  facultyId: string;
  position: number;
};

type Props = {
  faculties: FacultyItem[];
  onRemove: (facultyId: string) => void;
  onReorder: (reorderedFaculties: FacultyItem[]) => void;
};

/**
 * A grid that allows sorting faculty items via drag-and-drop.
 */
export function SortableGrid({ faculties, onRemove, onReorder }: Props) {
  const [items, setItems] = useState(faculties);

  useEffect(() => {
    setItems(faculties);
  }, [faculties]);

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
      const oldIndex = items.findIndex((item) => item.facultyId === active.id);
      const newIndex = items.findIndex((item) => item.facultyId === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);

      // Update positions based on new array order
      const updatedItems = newOrder.map((item, index) => ({
        ...item,
        position: index + 1,
      }));

      setItems(updatedItems);
      onReorder(updatedItems);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={items.map((item) => item.facultyId)} 
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <SortableItem
              key={item.facultyId}
              facultyId={item.facultyId}
              position={item.position}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
