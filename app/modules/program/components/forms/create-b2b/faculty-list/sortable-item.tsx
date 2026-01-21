"use client";

import React, { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@ui/button";
import { Move, Trash } from "lucide-react";
import FacultyCard from "@/modules/cohort/modules/cohort-content/core-content/faculty/faculty-card";
import { getFacultyByIdAction } from "./actions";

type FacultyData = {
  id: string;
  name: string;
  profile_image: string | null;
  description: string | null;
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
    zIndex: isDragging ? 1000 : 0,
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

  const handleRemove = () => {
    onRemove(facultyId);
  };

  if (loading) {
    return (
      <div className="bg-background border border-border rounded-md p-3 animate-pulse">
        <div className="w-full aspect-square rounded-md bg-muted mb-2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!facultyData) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative"
    >
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        <FacultyCard
          profile_image={facultyData.profile_image || ""}
          name={facultyData.name}
          description={facultyData.description || ""}
        />
      </div>
      
      {!isDragging && (
        <>
          <div className="mt-2">
            <Button
              type="button"
              onClick={handleRemove}
              variant="outline"
              className="text-destructive"
              size="sm"
            >
              <Trash className="size-4 mr-1" /> Remove
            </Button>
          </div>
          
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="size-8 cursor-grab"
              {...listeners}
            >
              <Move className="size-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
