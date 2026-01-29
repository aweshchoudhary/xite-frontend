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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./sortable-item";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";

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
 * A table that allows sorting faculty items via drag-and-drop.
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
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map((item) => item.facultyId)} 
          strategy={verticalListSortingStrategy}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-40 truncate">Academic Partner</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <SortableItem
                  key={item.facultyId}
                  facultyId={item.facultyId}
                  position={item.position}
                  onRemove={onRemove}
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
  );
}
