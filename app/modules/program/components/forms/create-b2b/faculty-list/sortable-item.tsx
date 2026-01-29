"use client";

import React, { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@ui/button";
import { GripVertical, Trash, GraduationCap } from "lucide-react";
import { getFacultyByIdAction } from "./actions";
import { TableCell, TableRow } from "@ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { getImageUrl } from "@/modules/common/lib/utils";

type FacultyData = {
  id: string;
  name: string;
  profile_image: string | null;
  description: string | null;
  title: string | null;
  academic_partner: {
    id: string;
    name: string;
    logo_url: string | null;
  } | null;
};

type Props = {
  facultyId: string;
  position: number;
  onRemove: (facultyId: string) => void;
};

export function SortableItem({ facultyId, position, onRemove }: Props) {
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: facultyId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "relative" as const,
    zIndex: isDragging ? 1000 : undefined,
  };

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        const data = await getFacultyByIdAction(facultyId);
        setFacultyData(data);
      } catch (error) {
        console.error("Error fetching faculty:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [facultyId]);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(facultyId);
  };

  if (loading) {
    return (
      <TableRow>
        <TableCell><div className="h-8 w-8 bg-muted rounded animate-pulse"></div></TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
              <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </TableCell>
        <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse"></div></TableCell>
        <TableCell><div className="h-8 w-16 bg-muted rounded animate-pulse"></div></TableCell>
      </TableRow>
    );
  }

  if (!facultyData) {
    return null;
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-50" : ""}
    >
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            type="button"
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
        <div className="flex items-center gap-2">
          <Avatar className="size-9 border">
            {facultyData.profile_image ? (
              <AvatarImage
                src={getImageUrl(facultyData.profile_image)}
                alt={facultyData.name}
                width={100}
                height={100}
              />
            ) : null}
            <AvatarFallback className="uppercase">
              <GraduationCap className="size-5 text-muted-foreground opacity-50" />
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-semibold">{facultyData.name}</span>
            <p className="truncate w-40 text-muted-foreground text-sm">
              {facultyData.title || "-"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        {facultyData.academic_partner ? (
          <div className="flex items-center gap-2 w-40 truncate">
            <Avatar className="size-9">
              {facultyData.academic_partner.logo_url ? (
                <AvatarImage
                  src={getImageUrl(facultyData.academic_partner.logo_url)}
                  alt={facultyData.academic_partner.name}
                />
              ) : null}
              <AvatarFallback className="uppercase text-xs">
                {facultyData.academic_partner.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span>{facultyData.academic_partner.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            type="button"
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
  );
}
