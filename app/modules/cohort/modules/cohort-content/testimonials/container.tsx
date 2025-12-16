"use client";
import { useState } from "react";
import View from "./view";
import Update from "./update";
import { Button } from "@ui/button";
import { Pencil } from "lucide-react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";

import { Badge } from "@ui/badge";
import { Switch } from "@ui/switch";
import { updateSectionVisibilityAction } from "./action";
import { toast } from "sonner";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";

type ContainerProps = {
  data?: GetCohort;
};

export function Container({ data }: ContainerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isCompleted =
    data?.testimonial_section?.title &&
    data?.testimonial_section?.items.length > 0;

  const isUserHasCohortAccess = useCheckUserOwnsCohort(data?.id || "");

  if (!data) return null;
  return (
    <div className="group relative bg-background p-5 rounded-xl transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <Badge variant={isCompleted ? "success" : "destructive"}>
          {isCompleted ? "Completed" : "Incomplete"}
        </Badge>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span>
              {data?.testimonial_section?.is_section_visible
                ? "Visible"
                : "Hidden"}
            </span>
            <Switch
              checked={data?.testimonial_section?.is_section_visible}
              onCheckedChange={(checked) => {
                toast.promise(
                  updateSectionVisibilityAction({
                    recordId: data?.testimonial_section?.id || "",
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
              title: data?.testimonial_section?.title || "Program Testimonials",
              items:
                data?.testimonial_section?.items.map((item) => ({
                  title: item.title,
                  position: item.position,
                  quote: item.quote,
                  user_image_url: item.user_image_url,
                  user_name: item.user_name,
                  user_designation: item.user_designation,
                  user_company: item.user_company,
                  action: "upload",
                })) || [],
              description: data?.testimonial_section?.description || "",
              cohort_id: data?.id || "",
            }}
            onCancel={() => setIsUpdating(false)}
            onSuccess={() => setIsUpdating(false)}
          />
        </div>
      ) : (
        <View data={data?.testimonial_section} />
      )}
    </div>
  );
}
