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
import { updateCardOrder } from "./action";

interface Item {
  id: number;
  name: string;
  profile_image: string;
  description: string;
  position: number;
  itemId: string;
  sectionId: string;
}

/**
 * A grid that allows sorting items via drag-and-drop.
 * @param initialItems The initial array of items to display and sort.
 */
export function SortableGrid({
  initialItems,
  selectedFacultyIds,
}: {
  initialItems: Item[];
  selectedFacultyIds: string[];
}) {
  const [items, setItems] = useState<Item[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);

      // Update positions based on new array order
      const updatedItems = newOrder.map((item, index) => ({
        ...item,
        position: index + 1, // 1-based positioning
      }));

      setItems(updatedItems);
      await updateCardOrder(updatedItems);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              selectedFacultyIds={selectedFacultyIds}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
