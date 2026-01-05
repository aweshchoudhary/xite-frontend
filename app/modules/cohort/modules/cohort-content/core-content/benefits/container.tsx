"use client";
import { useState } from "react";
import View from "./view";
import Update from "./update";
import { Button } from "@ui/button";
import { Pencil } from "lucide-react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { Badge } from "@ui/badge";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";

type ContainerProps = {
  data?: GetCohort;
};

export function Container({ data }: ContainerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isCompleted =
    data?.benefits_section?.title &&
    data?.benefits_section?.benefits_items.length > 0;

  if (!data) return null;

  const isUserHasCohortAccess = useCheckUserOwnsCohort(data?.id);

  return (
    <div className="group relative bg-card rounded-xl transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <Badge variant={isCompleted ? "success" : "destructive"}>
          {isCompleted ? "Completed" : "Incomplete"}
        </Badge>
        <div className="flex items-center gap-2">
          {!isUpdating && data?.status !== "ACTIVE" && isUserHasCohortAccess ? (
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
      {isUpdating ? (
        <div>
          <Update
            defaultValues={{
              benefits_items:
                data?.benefits_section?.benefits_items.map((item) => ({
                  title: item.title,
                  icon_image_file_action: "upload",
                  icon_image_url: item.icon_image_url,
                })) || [],
              title: data?.benefits_section?.title || "Program Benefits",
              top_description: data?.benefits_section?.top_description || "",
              bottom_description:
                data?.benefits_section?.bottom_description || "",
              section_width: data?.benefits_section?.section_width || "center",
              cohort_id: data?.id || "",
            }}
            onCancel={() => setIsUpdating(false)}
            onSuccess={() => setIsUpdating(false)}
          />
        </div>
      ) : (
        <View data={data?.benefits_section} />
      )}
    </div>
  );
}
