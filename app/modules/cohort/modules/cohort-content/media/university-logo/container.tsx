"use client";
import { useState } from "react";
import View from "./view";
import Update from "./update";
import { Button } from "@ui/button";
import { Pencil, X } from "lucide-react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { Badge } from "@ui/badge";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";

type Props = {
  data?: GetCohort;
};

export default function Container({ data }: Props) {
  const [isUpdating, setUpdating] = useState(false);
  const isCompleted =
    data?.media_section?.university_logo_url &&
    data?.media_section?.university_logo_width;

  if (!data) return null;

  const isUserHasCohortAccess = useCheckUserOwnsCohort(data?.id);

  return (
    <div className="group relative bg-card rounded-xl transition-all duration-200">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>University Logo</div>
          <div className="flex items-center gap-2">
            {!isUpdating &&
            data?.status !== "ACTIVE" &&
            isUserHasCohortAccess ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setUpdating(true);
                }}
                size={"sm"}
                variant="secondary"
              >
                <Pencil className="size-3.5" />
                Edit
              </Button>
            ) : null}
            <Badge variant={isCompleted ? "success" : "destructive"}>
              {isCompleted ? "Completed" : "Incomplete"}
            </Badge>
          </div>
        </div>

        {isUpdating ? (
          <div>
            <Update
              defaultValues={{
                university_logo_url:
                  data?.media_section?.university_logo_url || "",
                university_logo_width:
                  data?.media_section?.university_logo_width || 0,
                cohort_id: data?.id || "",
                id: data?.media_section?.id || "",
              }}
              onCancel={() => setUpdating(false)}
              onSuccess={() => setUpdating(false)}
            />
          </div>
        ) : (
          <View data={data?.media_section} cohortId={data?.id || ""} />
        )}
      </div>
    </div>
  );
}
