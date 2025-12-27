"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/tabs";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { FileText, Globe, Check, TriangleAlert } from "lucide-react";
import { Badge } from "@ui/badge";
import CohortOverview from "./overview";
import TemplatesContainer from "./microsite-cms/templates/container";
import { useSearchParams } from "next/navigation";

type Props = {
  data: GetCohort;
};

const tabs = [
  {
    value: "content",
    label: "Core Content",
    icon: FileText,
    showCompleteStatus: true,
  },
  {
    value: "microsite-cms",
    label: "Microsite",
    icon: Globe,
    showCompleteStatus: true,
  },
];

export default function CohortContent({ data }: Props) {
  // get query params ?tab=microsite-cms
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const defaultValue = tab || "content";
  return (
    <section className="space-y-6 w-full">
      <div className="flex items-center gap-2 justify-between">
        <h2 className="text-lg font-semibold">Cohort Content</h2>
      </div>
      <Tabs defaultValue={defaultValue} className="w-full">
        <div className="bg-background rounded-lg px-4 border py-3">
          <TabsList className="w-full grid grid-cols-2 gap-1 bg-transparent h-auto p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                disabled={data.status === "DRAFT" && tab.value !== "overview"}
                key={tab.value}
                value={tab.value}
                className="py-3 px-2 data-[state=active]:bg-sidebar-accent/40 data-[state=active]:text-primary relative hover:bg-accent text-muted-foreground transition-all duration-200 rounded-md"
              >
                {data?.status !== "ACTIVE" && tab.showCompleteStatus ? (
                  <Badge
                    variant={
                      isSectionsCompleted(data)[
                        tab.value as keyof CohortCompletionStatus
                      ]
                        ? "success"
                        : "warning"
                    }
                    className="size-6 rounded-full p-0 flex items-center justify-center absolute top-1 right-1"
                  >
                    {isSectionsCompleted(data)[
                      tab.value as keyof CohortCompletionStatus
                    ] ? (
                      <Check className="size-5 shrink-0" />
                    ) : (
                      <TriangleAlert className="size-5 shrink-0" />
                    )}
                  </Badge>
                ) : null}
                <tab.icon className="size-6 text-inherit" strokeWidth={1.5} />
                <p className="text-sm font-medium whitespace-pre-line">
                  {tab.label}
                </p>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="content" className={`mt-0`}>
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

type CohortCompletionStatus = {
  media: boolean;
  overview: boolean;
  curriculum: boolean;
  faculty: boolean;
  experts: boolean;
  certification: boolean;
  statistics: boolean;
  testimonials: boolean;
  microsite: boolean;
};

export const isSectionsCompleted = (
  data: GetCohort
): CohortCompletionStatus => {
  const isMediaSectionCompleted =
    !!data.media_section &&
    !!data.media_section.university_logo_url &&
    !!data.media_section.banner_image_url &&
    !!data.media_section.university_banner_url &&
    !!data.media_section.brochure_url;

  const isOverviewCompleted =
    !!data.overview_section &&
    !!data.overview_section.title &&
    !!data.overview_section.description;

  const isBenefitsSectionCompleted =
    !!data.benefits_section &&
    !!data.benefits_section.title &&
    (data.benefits_section.benefits_items?.length ?? 0) > 0;

  const isWhoShouldApplySectionCompleted =
    !!data.who_should_apply_section &&
    !!data.who_should_apply_section.title &&
    !!data.who_should_apply_section.description;

  const isOverviewSectionCompleted =
    isOverviewCompleted &&
    isWhoShouldApplySectionCompleted &&
    isBenefitsSectionCompleted;

  const isCurriculumSectionCompleted =
    !!data.design_curriculum_section &&
    !!data.design_curriculum_section.title &&
    (data.design_curriculum_section.items?.length ?? 0) > 0;

  const isFacultySectionCompleted =
    !!data.faculty_section &&
    !!data.faculty_section.title &&
    (data.faculty_section.items?.length ?? 0) > 0;

  const isIndustryExpertsSectionCompleted =
    !!data.industry_experts_section &&
    !!data.industry_experts_section.title &&
    (data.industry_experts_section.items?.length ?? 0) > 0;

  const isCertificationSectionCompleted =
    !!data.certification_section &&
    !!data.certification_section.title &&
    !!data.certification_section.certificate_image_url;

  const isStatisticsSectionCompleted =
    !!data.statistics_section &&
    !!data.statistics_section.title &&
    !!data.statistics_section.work_experience_item &&
    !!data.statistics_section.industry_item &&
    !!data.statistics_section.designation_item &&
    !!data.statistics_section.company_item;

  const isTestimonialsSectionCompleted =
    !!data.testimonial_section &&
    !!data.testimonial_section.title &&
    (data.testimonial_section.items?.length ?? 0) > 0;

  const isBrandingSectionCompleted =
    !!data?.cohort_branding?.font_name &&
    !!data?.cohort_branding?.default_border_radius &&
    !!data?.cohort_branding?.primary_color?.text_color &&
    !!data?.cohort_branding?.primary_color?.background_color &&
    !!data?.cohort_branding?.secondary_color?.text_color &&
    !!data?.cohort_branding?.secondary_color?.background_color &&
    !!data?.cohort_branding?.background_color?.text_color &&
    !!data?.cohort_branding?.background_color?.background_color;

  const isMicrositeSectionCompleted = !!data?.microsite_section?.custom_domain;

  return {
    media: data.media_section?.is_section_visible
      ? isMediaSectionCompleted
      : true,
    overview: data.overview_section?.is_section_visible
      ? isOverviewSectionCompleted
      : true,
    curriculum: data.design_curriculum_section?.is_section_visible
      ? isCurriculumSectionCompleted
      : true,
    faculty: data.faculty_section?.is_section_visible
      ? isFacultySectionCompleted
      : true,
    experts: data.industry_experts_section?.is_section_visible
      ? isIndustryExpertsSectionCompleted
      : true,
    certification: data.certification_section?.is_section_visible
      ? isCertificationSectionCompleted
      : true,
    statistics: data.statistics_section?.is_section_visible
      ? isStatisticsSectionCompleted
      : true,
    testimonials: data.testimonial_section?.is_section_visible
      ? isTestimonialsSectionCompleted
      : true,
    microsite: isMicrositeSectionCompleted && isBrandingSectionCompleted,
  };
};
