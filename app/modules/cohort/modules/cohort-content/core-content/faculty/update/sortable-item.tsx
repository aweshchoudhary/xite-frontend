"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@ui/button";
import { GripVertical, Plus, Trash, GraduationCap } from "lucide-react";
import { removeFacultyItemFromSection } from "./action";
import { toast } from "sonner";
import FacultySelectPopover from "./faculty-select-popover";
import { TableCell, TableRow } from "@ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { getImageUrl } from "@/modules/common/lib/utils";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import Link from "next/link";

interface Item {
  id: number;
  position: number;
  name: string;
  profile_image: string;
  description: string;
  title: string;
  itemId: string;
  sectionId: string;
  facultyId: string;
  academic_partner: PrimaryDB.AcademicPartner | null;
}

interface SortableItemProps {
  item: Item;
  selectedFacultyIds: string[];
  isLast?: boolean;
}

export function SortableTableRow({
  item,
  selectedFacultyIds,
  isLast,
}: SortableItemProps) {
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
    position: "relative" as const,
    zIndex: isDragging ? 1000 : undefined,
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.promise(removeFacultyItemFromSection({ itemId: item.itemId }), {
      loading: "Removing faculty item...",
      success: "Faculty item removed",
      error: "Failed to remove faculty item",
    });
  };

  return (
    <>
      <TableRow
        ref={setNodeRef}
        style={style}
        className={isDragging ? "opacity-50" : ""}
      >
        <TableCell>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="cursor-grab touch-none h-8 w-8"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </TableCell>
        <TableCell>
          <Link
            href={`/faculty/${item.facultyId}`}
            className="flex items-center gap-2 hover:underline"
          >
            <Avatar className="size-9 border">
              {item.profile_image ? (
                <AvatarImage
                  src={getImageUrl(item.profile_image)}
                  alt={item.name}
                  width={100}
                  height={100}
                />
              ) : null}
              <AvatarFallback className="uppercase">
                <GraduationCap className="size-5 text-muted-foreground opacity-50" />
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-semibold">{item.name}</span>
              <p className="truncate w-40 text-muted-foreground text-sm">
                {item.title}
              </p>
            </div>
          </Link>
        </TableCell>
        <TableCell>
          {item.academic_partner ? (
            <div className="flex items-center gap-2 w-40 truncate">
              <Avatar className="size-9">
                {item.academic_partner.logo_url ? (
                  <AvatarImage
                    src={getImageUrl(item.academic_partner.logo_url)}
                    alt={item.academic_partner.name}
                  />
                ) : null}
                <AvatarFallback className="uppercase text-xs">
                  {item.academic_partner.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span>{item.academic_partner.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <FacultySelectPopover
              sectionId={item.sectionId}
              position={item.position}
              selectedFacultyIds={selectedFacultyIds}
            >
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Plus className="size-4" />
              </Button>
            </FacultySelectPopover>
            <Button
              onClick={handleRemove}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash className="size-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isLast && (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={5} className="text-center py-2">
            <FacultySelectPopover
              sectionId={item.sectionId}
              position={item.position + 1}
              selectedFacultyIds={selectedFacultyIds}
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="size-4" />
                Add Faculty
              </Button>
            </FacultySelectPopover>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// Keep old export for backward compatibility
export { SortableTableRow as SortableItem };
