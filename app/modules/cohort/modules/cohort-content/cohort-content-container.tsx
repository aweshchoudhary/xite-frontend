"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/tabs";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { FileText, Globe, Check, TriangleAlert } from "lucide-react";
import { Badge } from "@ui/badge";
import CohortOverview from "./core-content";
import TemplatesContainer from "./microsite-cms/templates/container";
import { useSearchParams } from "next/navigation";

type Props = {
  data: GetCohort;
};

export default function CohortContent({ data }: Props) {
  // get query params ?tab=microsite-cms
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const defaultValue = tab || "core-content";
  return (
    <section className="space-y-6 w-full">
      <div className="flex items-center gap-2 justify-between">
        <h2 className="text-lg font-semibold">Cohort Content</h2>
      </div>
      <Tabs defaultValue={defaultValue} className="w-full">
        <div className="bg-background rounded-lg px-4 border py-3">
          <TabsList className="w-full grid grid-cols-2 gap-1 bg-transparent h-auto p-0">
            <TabsTrigger
              value="core-content"
              className="py-3 px-2 data-[state=active]:bg-sidebar-accent/40 data-[state=active]:text-primary relative hover:bg-accent text-muted-foreground transition-all duration-200 rounded-md"
            >
              {data?.status !== "ACTIVE" ? (
                <Badge
                  variant={isSectionsCompleted(data) ? "success" : "warning"}
                  className="size-6 rounded-full p-0 flex items-center justify-center absolute top-1 right-1"
                >
                  {isSectionsCompleted(data) ? (
                    <Check className="size-5 shrink-0" />
                  ) : (
                    <TriangleAlert className="size-5 shrink-0" />
                  )}
                </Badge>
              ) : null}
              <FileText className="size-6 text-inherit" strokeWidth={1.5} />
              <p className="text-sm font-medium whitespace-pre-line">
                Core Content
              </p>
            </TabsTrigger>
            <TabsTrigger
              value="microsite-cms"
              className="py-3 px-2 data-[state=active]:bg-sidebar-accent/40 data-[state=active]:text-primary relative hover:bg-accent text-muted-foreground transition-all duration-200 rounded-md"
            >
              <Globe className="size-6 text-inherit" strokeWidth={1.5} />
              <p className="text-sm font-medium whitespace-pre-line">
                Microsite
              </p>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="core-content" className={`mt-0`}>
            <CohortOverview data={data} />
          </TabsContent>
          {data.status !== "DRAFT" ? (
            <>
              <TabsContent value="microsite-cms" className="mt-0">
                <TemplatesContainer data={data} />
              </TabsContent>
            </>
          ) : null}
        </div>
      </Tabs>
    </section>
  );
}

export const isSectionsCompleted = (data: GetCohort): boolean => {
  const isOverviewCompleted =
    !!data.overview_section &&
    !!data.overview_section.title &&
    !!data.overview_section.description;

  const isCurriculumSectionCompleted =
    !!data.design_curriculum_section &&
    !!data.design_curriculum_section.title &&
    (data.design_curriculum_section.items?.length ?? 0) > 0;

  const isBenefitsSectionCompleted =
    !!data.benefits_section &&
    !!data.benefits_section.title &&
    (data.benefits_section.benefits_items?.length ?? 0) > 0;

  const isFacultySectionCompleted =
    !!data.faculty_section &&
    !!data.faculty_section.title &&
    (data.faculty_section.items?.length ?? 0) > 0;

  const isWhoShouldApplySectionCompleted =
    !!data.who_should_apply_section &&
    !!data.who_should_apply_section.title &&
    !!data.who_should_apply_section.description;

  const isMediaSectionComplete =
    !!data.media_section?.banner_image_url &&
    !!data.media_section?.brochure_url &&
    !!data.media_section?.university_banner_url &&
    !!data.media_section?.university_logo_url;

  return (
    isOverviewCompleted &&
    isCurriculumSectionCompleted &&
    isBenefitsSectionCompleted &&
    isFacultySectionCompleted &&
    isWhoShouldApplySectionCompleted &&
    isMediaSectionComplete
  );
};
