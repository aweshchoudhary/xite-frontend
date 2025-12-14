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
    data?.who_should_apply_section?.title &&
    data?.who_should_apply_section?.description;

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
              title:
                data?.who_should_apply_section?.title || "Who Should Apply",
              description: data?.who_should_apply_section?.description || "",
              cohort_id: data?.id || "",
            }}
            onCancel={() => setIsUpdating(false)}
            onSuccess={() => setIsUpdating(false)}
          />
        </div>
      ) : (
        <View data={data?.who_should_apply_section} />
      )}
    </div>
  );
}
