"use client";
import { useState } from "react";
import View from "./view";
import Update from "./update";
import { Button } from "@/modules/common/components/ui/button";
import { Pencil } from "lucide-react";
import { Badge } from "@/modules/common/components/ui/badge";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";

type ContainerProps = {
  data?: GetCohort;
};

export function Container({ data }: ContainerProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!data) return null;

  const isUserHasCohortAccess = useCheckUserOwnsCohort(data?.id);

  const isCompleted =
    data?.cohort_branding?.font_name &&
    data?.cohort_branding?.default_border_radius &&
    data?.cohort_branding?.primary_color?.text_color &&
    data?.cohort_branding?.primary_color?.background_color &&
    data?.cohort_branding?.secondary_color?.text_color &&
    data?.cohort_branding?.secondary_color?.background_color &&
    data?.cohort_branding?.background_color?.text_color &&
    data?.cohort_branding?.background_color?.background_color;

  return (
    <div className="group relative border bg-background p-5 rounded-xl transition-all duration-200">
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
        <div className="bg-muted/50 rounded-lg p-4">
          <Update
            defaultValues={{
              font_name: data?.cohort_branding?.font_name || undefined,
              default_border_radius:
                data?.cohort_branding?.default_border_radius || undefined,
              primary_color: {
                text_color:
                  data?.cohort_branding?.primary_color?.text_color ?? "",
                background_color:
                  data?.cohort_branding?.primary_color?.background_color ?? "",
              },
              secondary_color: {
                text_color:
                  data?.cohort_branding?.secondary_color?.text_color ?? "",
                background_color:
                  data?.cohort_branding?.secondary_color?.background_color ??
                  "",
              },
              background_color: {
                text_color:
                  data?.cohort_branding?.background_color?.text_color ?? "",
                background_color:
                  data?.cohort_branding?.background_color?.background_color ??
                  "",
              },
              cohort_id: data?.id,
            }}
            onCancel={() => setIsUpdating(false)}
            onSuccess={() => setIsUpdating(false)}
          />
        </div>
      ) : (
        <View data={data?.cohort_branding} />
      )}
    </div>
  );
}
