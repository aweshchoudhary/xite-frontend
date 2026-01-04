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
    data?.design_curriculum_section?.title &&
    data?.design_curriculum_section?.items.length > 0;

  const sectionData = data?.design_curriculum_section;

  const isUserHasCohortAccess = useCheckUserOwnsCohort(data?.id || "");

  if (!data) return null;
  return (
    <div className="group relative transition-all duration-200">
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
      {isUpdating ? (
        <div>
          <Update
            defaultValues={{
              title: sectionData?.title || "Program Curriculum",
              top_description: sectionData?.top_description || "",
              bottom_description: sectionData?.bottom_description || "",
              items:
                sectionData?.items?.map((item) => ({
                  position: item.position,
                  title: item.title,
                  overview: item.overview || "",
                  objectives:
                    item.objectives?.map((objective) => ({
                      position: objective.position,
                      description: objective.description,
                    })) || [],
                  sessions:
                    item.sessions?.map((session) => {
                      // Type assertion for sub_topic data
                      const sessionData = session as {
                        position: number;
                        title: string;
                        overview: string | null;
                        objectives: Array<{
                          position: number;
                          description: string;
                        }>;
                        sub_topic?: {
                          topic_id: string;
                          topic?: { id: string };
                        } | null;
                        sub_topic_id?: string | null;
                      };
                      return {
                        position: sessionData.position,
                        title: sessionData.title,
                        objectives:
                          sessionData.objectives?.map((objective) => ({
                            position: objective.position,
                            description: objective.description,
                          })) || [],
                        overview: sessionData.overview || "",
                        topic_id:
                          sessionData.sub_topic?.topic_id ||
                          sessionData.sub_topic?.topic?.id ||
                          null,
                        sub_topic_id: sessionData.sub_topic_id || null,
                      };
                    }) || [],
                })) || [],
              cohort_id: data?.id || "",
            }}
            onCancel={() => setIsUpdating(false)}
            onSuccess={() => setIsUpdating(false)}
          />
        </div>
      ) : (
        <View data={data?.design_curriculum_section} />
      )}
    </div>
  );
}
