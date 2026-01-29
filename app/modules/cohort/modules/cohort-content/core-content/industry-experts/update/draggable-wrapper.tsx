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

import { SortableTableRow } from "./sortable-item";
import { updateCardOrder } from "./action";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { PrimaryDB } from "@/modules/common/database/prisma/types";

interface Item {
  id: number;
  name: string;
  profile_image: string;
  description: string;
  title: string;
  position: number;
  itemId: string;
  sectionId: string;
  facultyId: string;
  academic_partner: PrimaryDB.AcademicPartner | null;
}

/**
 * A table that allows sorting items via drag-and-drop.
 * @param initialItems The initial array of items to display and sort.
 */
export function SortableTable({
  initialItems,
  selectedExpertIds,
}: {
  initialItems: Item[];
  selectedExpertIds: string[];
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
    <div className="rounded-lg border">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Academic Partner</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <SortableTableRow
                  key={item.id}
                  item={item}
                  selectedExpertIds={selectedExpertIds}
                  isLast={index === items.length - 1}
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// Keep the old export for backward compatibility
export { SortableTable as SortableGrid };
