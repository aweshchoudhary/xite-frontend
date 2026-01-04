"use client";
import { useState } from "react";
import View from "./view";
import Update from "./update";
import { Pencil } from "lucide-react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";

type ContainerProps = {
  data?: GetCohort;
};

export function Container({ data }: ContainerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isCompleted =
    data?.overview_section?.title && data?.overview_section?.description;

  const isUserHasCohortAccess = useCheckUserOwnsCohort(data?.id || "");
  if (!data) return null;

  return (
    <div className="group relative bg-card rounded-xl transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <Badge variant={isCompleted ? "success" : "destructive"}>
          {isCompleted ? "Completed" : "Incomplete"}
        </Badge>
        <div className="flex items-center gap-2">
          {!isUpdating &&
          // data?.status !== "PLANNING" &&
          isUserHasCohortAccess ? (
            <Button
              onClick={(e) => {
                e.preventDefault();
                setIsUpdating(true);
              }}
              size={"sm"}
              variant="secondary"
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
          ) : null}
        </div>
      </div>
      <div>
        {isUpdating ? (
          <div>
            <Update
              defaultValues={{
                title: data?.overview_section?.title || "Program Overview",
                description:
                  data?.overview_section?.description || "Add description here",
                top_description: data?.overview_section?.top_description || "",
                bottom_description:
                  data?.overview_section?.bottom_description || "",
                section_width:
                  data?.overview_section?.section_width || "center",
                cohort_id: data?.id || "",
              }}
              onCancel={() => setIsUpdating(false)}
              onSuccess={() => setIsUpdating(false)}
            />
          </div>
        ) : (
          <View data={data?.overview_section} />
        )}
      </div>
    </div>
  );
}
