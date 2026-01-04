"use client";
import View from "./view";
import { Button } from "@ui/button";
import { Pencil } from "lucide-react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { Badge } from "@ui/badge";
import { useState } from "react";
import Update from "./update";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";

type ContainerProps = {
  data?: GetCohort;
};

export function Container({ data }: ContainerProps) {
  const [saveForm, setSaveForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const isCompleted =
    data?.faculty_section?.title && data?.faculty_section?.items.length > 0;

  const isUserHasCohortAccess = useCheckUserOwnsCohort(data?.id || "");

  if (!data || !data?.faculty_section) return null;

  if (!data) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <Badge variant={isCompleted ? "success" : "destructive"}>
          {isCompleted ? "Completed" : "Incomplete"}
        </Badge>
        {isUserHasCohortAccess && data?.status !== "ACTIVE" ? (
          <div className="flex items-center gap-2">
            {!isUpdating ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setSaveForm(false);
                  setIsUpdating(true);
                }}
                size={"sm"}
                variant="secondary"
                type="button"
              >
                <Pencil className="size-3.5" />
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsUpdating(false);
                  }}
                  size={"sm"}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setSaveForm(true);
                  }}
                  size={"sm"}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <div>
        {isUpdating ? (
          <Update
            cohortId={data.id}
            data={data?.faculty_section}
            onSuccess={() => {
              setIsUpdating(false);
              setSaveForm(false);
            }}
            onCancel={() => {
              setIsUpdating(false);
              setSaveForm(false);
            }}
            saveForm={saveForm}
          />
        ) : (
          <View data={data?.faculty_section} />
        )}
      </div>
    </div>
  );
}
