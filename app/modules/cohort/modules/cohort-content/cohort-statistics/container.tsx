"use client";
import { useState } from "react";
import View from "./view";
import Update from "./update";
import { Button } from "@ui/button";
import { Pencil } from "lucide-react";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/accordion";
import { Badge } from "@ui/badge";
import { Switch } from "@ui/switch";
import { toast } from "sonner";
import { updateSectionVisibilityAction } from "./action";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";

type ContainerProps = {
  data?: GetCohort;
};

export function Container({ data }: ContainerProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const st = data?.statistics_section;
  const wi = st?.work_experience_item;
  const ii = st?.industry_item;
  const di = st?.designation_item;
  const ci = st?.company_item;

  const wiCompleted = !!wi?.chart_image_url && !!wi?.title && !!wi?.description;
  const iiCompleted = !!ii?.title && (ii?.data_list?.items?.length ?? 0) > 0;
  const diCompleted = !!di?.title && (di?.data_list?.items?.length ?? 0) > 0;
  const ciCompleted = !!ci?.title && !!ci?.image_url;

  const isCompleted =
    !!st?.title && wiCompleted && iiCompleted && diCompleted && ciCompleted;

  if (!data) return null;

  const isUserHasCohortAccess = useCheckUserOwnsCohort(data?.id);

  return (
    <div className="group relative bg-background p-5 rounded-xl transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <Badge variant={isCompleted ? "success" : "destructive"}>
          {isCompleted ? "Completed" : "Incomplete"}
        </Badge>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span>
              {data?.statistics_section?.is_section_visible
                ? "Visible"
                : "Hidden"}
            </span>
            <Switch
              checked={data?.statistics_section?.is_section_visible}
              onCheckedChange={(checked) => {
                toast.promise(
                  updateSectionVisibilityAction({
                    recordId: data?.statistics_section?.id || "",
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
              title: data?.statistics_section?.title || "Cohort Statistics",
              cohort_id: data?.id,
              work_experience_item: {
                title:
                  data?.statistics_section?.work_experience_item?.title ??
                  "Work Experience",
                description:
                  data?.statistics_section?.work_experience_item?.description ??
                  "",
                chart_image_url:
                  data?.statistics_section?.work_experience_item
                    ?.chart_image_url ?? "",
                chart_image_file: undefined,
              },
              industry_item: {
                title:
                  data?.statistics_section?.industry_item?.title ??
                  "Industries",
                description:
                  data?.statistics_section?.industry_item?.description ?? "",
                data_list: {
                  title:
                    data?.statistics_section?.industry_item?.data_list?.title ??
                    "",
                  items:
                    data?.statistics_section?.industry_item?.data_list?.items ??
                    [],
                },
              },
              designation_item: {
                title:
                  data?.statistics_section?.designation_item?.title ??
                  "Designations",
                description:
                  data?.statistics_section?.designation_item?.description ?? "",
                data_list: {
                  title:
                    data?.statistics_section?.designation_item?.data_list
                      ?.title ?? "",
                  items:
                    data?.statistics_section?.designation_item?.data_list
                      ?.items ?? [],
                },
              },
              company_item: {
                title:
                  data?.statistics_section?.company_item?.title ?? "Companies",
                top_description:
                  data?.statistics_section?.company_item?.top_description ?? "",
                bottom_description:
                  data?.statistics_section?.company_item?.bottom_description ??
                  "",
                image_url:
                  data?.statistics_section?.company_item?.image_url ?? "",
                image_file: undefined,
                image_file_action: "upload",
              },
            }}
            onCancel={() => setIsUpdating(false)}
            onSuccess={() => setIsUpdating(false)}
          />
        </div>
      ) : (
        <View data={data?.statistics_section} />
      )}
    </div>
  );
}
