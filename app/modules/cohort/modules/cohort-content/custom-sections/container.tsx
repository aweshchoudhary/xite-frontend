"use client";
import { useState } from "react";
import View from "./view";
import Update from "./update";
import { Pencil } from "lucide-react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { Button } from "@ui/button";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";

type ContainerProps = {
  data?: GetCohort;
};

export function Container({ data }: ContainerProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!data) return null;

  const isUserHasCohortAccess = useCheckUserOwnsCohort(data?.id);

  return (
    <div className="group relative bg-card rounded-xl transition-all duration-200 p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {!isUpdating && isUserHasCohortAccess ? (
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
                cohort_id: data?.id || "",
                sections:
                  data?.generic_sections.map(
                    ({
                      updated_at,
                      updated_by_id,
                      created_at,
                      cohort_id,
                      ...section
                    }) => ({
                      ...section,
                      // banner_image_position: "left",
                      banner_image_action: "upload",
                      after_section_id: "",
                      background: {
                        text_color: section.background?.text_color ?? "",
                        background_color:
                          section.background?.background_color ?? "",
                      },
                    })
                  ) || [],
              }}
              cohortData={data}
              onCancel={() => setIsUpdating(false)}
              onSuccess={() => setIsUpdating(false)}
            />
          </div>
        ) : (
          <View data={data?.generic_sections} cohortData={data} />
        )}
      </div>
    </div>
  );
}
