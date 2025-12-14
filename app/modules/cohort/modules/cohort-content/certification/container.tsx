"use client";
import { useState } from "react";
import View from "./view";
import Update from "./update";
import { Button } from "@/modules/common/components/ui/button";
import { Pencil } from "lucide-react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { Badge } from "@/modules/common/components/ui/badge";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";

type ContainerProps = {
  data?: GetCohort;
};

export function Container({ data }: ContainerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isCompleted =
    data?.certification_section?.title &&
    data?.certification_section?.certificate_image_url &&
    data?.certification_section?.bottom_description;

  if (!data) return null;

  const isUserHasCohortAccess = useCheckUserOwnsCohort(data?.id);
  return (
    <div className="group relative bg-background p-5 rounded-xl transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
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
              title: data?.certification_section?.title || "Certification",
              certificate_image_url:
                data?.certification_section?.certificate_image_url || "",
              top_description:
                data?.certification_section?.top_description || "",
              bottom_description:
                data?.certification_section?.bottom_description ||
                "Add bottom description",
              cohort_id: data?.id || "",
              id: data?.certification_section?.id || "",
            }}
            onCancel={() => setIsUpdating(false)}
            onSuccess={() => setIsUpdating(false)}
          />
        </div>
      ) : (
        <View data={data?.certification_section} />
      )}
    </div>
  );
}
