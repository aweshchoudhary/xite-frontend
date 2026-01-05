"use client";
import { useEffect, useState } from "react";
import View from "./view";
import Update from "./update";
import { Button } from "@ui/button";
import { Pencil } from "lucide-react";
import {
  CohortSectionWithData,
  GetCohort,
  GetSectionOrderByCohortIdOutput,
  getCohortSections,
  getSectionOrderByCohortId,
} from "@/modules/cohort/server/cohort/read";

import { Container as BrandingContainer } from "../branding/container";
import { useCheckUserOwnsCohort } from "@/modules/cohort/auth/access";
import { Badge } from "@ui/badge";

type ContainerProps = {
  data?: GetCohort;
  previewDomain: string;
};

export function Container({ data, previewDomain }: ContainerProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const isUserHasCohortAccess = useCheckUserOwnsCohort(data?.id || "");
  const [sectionOrder, setSectionOrder] = useState<CohortSectionWithData[]>([]);

  const isCompleted = data?.microsite_section?.custom_domain;

  useEffect(() => {
    const fetchSectionOrder = async () => {
      const sectionOrder = await getCohortSections(data?.id || "");
      setSectionOrder(sectionOrder);
    };
    fetchSectionOrder();
  }, [data?.id]);

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="group relative bg-background p-5 rounded-xl transition-all duration-200">
        <div className="flex items-center justify-between mb-5">
          <div>Microsite Settings</div>
          <div className="flex items-center gap-2">
            <Badge variant={isCompleted ? "success" : "destructive"}>
              {isCompleted ? "Completed" : "Incomplete"}
            </Badge>
            {!isUpdating &&
            data?.status !== "ACTIVE" &&
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
                visibility_start_date:
                  data?.microsite_section?.visibility_start_date || null,
                visibility_end_date:
                  data?.microsite_section?.visibility_end_date || null,
                custom_domain: data?.microsite_section?.custom_domain || null,
                cohort_id: data?.id || "",
                sections: sectionOrder.map((section) => ({
                  id: section.id,
                  section_position: section.section_position,
                  section_type: section.section_type,
                  section_id: section.section_id,
                  section_title: section.data.title,
                  section_data: section.data,
                  data: section.data,
                })),
              }}
              onCancel={() => setIsUpdating(false)}
              onSuccess={() => setIsUpdating(false)}
            />
          </div>
        ) : (
          <View
            cohortData={data}
            data={data?.microsite_section}
            cohortKey={data?.cohort_key || data?.id || ""}
            previewDomain={previewDomain}
            cohort_id={data?.id || ""}
          />
        )}
      </div>
      <div>
        <BrandingContainer data={data} />
      </div>
    </div>
  );
}
