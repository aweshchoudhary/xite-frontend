"use client";
import View from "./view";
import { Button } from "@ui/button";
import { Pencil } from "lucide-react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { Badge } from "@ui/badge";
import { useState } from "react";
import Update from "./update";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";
import { Switch } from "@ui/switch";
import { updateSectionVisibilityAction } from "./action";
import { toast } from "sonner";

type ContainerProps = {
  data?: GetCohort;
};

export function Container({ data }: ContainerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveForm, setSaveForm] = useState(false);
  if (!data || !data?.industry_experts_section) return null;
  const isCompleted =
    data?.industry_experts_section?.title &&
    data?.industry_experts_section?.items.length > 0;

  if (!data) return null;

  const isUserHasCohortAccess = useCheckUserOwnsCohort(data?.id);

  return (
    <div className="group relative border bg-background p-5 rounded-xl transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <Badge variant={isCompleted ? "success" : "destructive"}>
          {isCompleted ? "Completed" : "Incomplete"}
        </Badge>
        {isUserHasCohortAccess && data?.status !== "ACTIVE" ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 pr-5">
              <span>
                {data?.industry_experts_section?.is_section_visible
                  ? "Visible"
                  : "Hidden"}
              </span>
              <Switch
                checked={data?.industry_experts_section?.is_section_visible}
                onCheckedChange={(checked) => {
                  toast.promise(
                    updateSectionVisibilityAction({
                      recordId: data?.industry_experts_section?.id || "",
                      isVisible: checked,
                    }),
                    {
                      loading: "Updating visibility...",
                      success: "Visibility updated",
                      error: "Failed to update visibility",
                    }
                  );
                }}
              />
            </div>
            {!isUpdating ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setSaveForm(false);
                  setIsUpdating(true);
                }}
                size={"sm"}
                variant="secondary"
              >
                <Pencil className="size-3.5" />
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSaveForm(false);
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
            data={data?.industry_experts_section}
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
          <View data={data?.industry_experts_section} />
        )}
      </div>
    </div>
  );
}
