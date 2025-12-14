"use client";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/modules/common/components/ui/tabs";
import { GetCohort } from "@/modules/cohort/server/cohort/read";
import { Container as CohortContentFaculty } from "./faculty/container";
import { Container as CohortCertification } from "./certification/container";
import { Container as CohortStatistics } from "./cohort-statistics/container";
import { Container as CohortContentMicrosite } from "./microsite/container";
import { Container as CohortContentIndustryExperts } from "./industry-experts/container";
import CohortContentMedia from "./media/index";
import { Container as CohortContentTestimonials } from "./testimonials/container";
import {
  FileText,
  Image,
  Users,
  Trophy,
  BarChart3,
  Globe,
  MessageCircle,
  GraduationCap,
  Check,
  X,
  TriangleAlert,
  TableOfContentsIcon,
} from "lucide-react";
import { Badge } from "@/modules/common/components/ui/badge";
import CohortOverview from "./overview";
import Link from "next/link";
import { buttonVariants } from "@/modules/common/components/ui/button";
import { Container as CohortContentCustomSections } from "./custom-sections/container";

type Props = {
  data: GetCohort;
};

const tabs = [
  {
    value: "overview",
    label: "Overview",
    icon: FileText,
    showCompleteStatus: true,
  },
  { value: "media", label: "Media", icon: Image, showCompleteStatus: true },
  {
    value: "faculty",
    label: "Faculty",
    icon: GraduationCap,
    showCompleteStatus: true,
  },
  {
    value: "experts",
    label: "Experts",
    icon: Users,
    showCompleteStatus: true,
  },
  {
    value: "certification",
    label: "Certification",
    icon: Trophy,
    showCompleteStatus: true,
  },
  {
    value: "statistics",
    label: "Cohort Statistics",
    icon: BarChart3,
    showCompleteStatus: true,
  },
  {
    value: "testimonials",
    label: "Testimonials",
    icon: MessageCircle,
    showCompleteStatus: true,
  },
  {
    value: "custom",
    label: "Custom Sections",
    icon: TableOfContentsIcon,
    showCompleteStatus: false,
  },
  {
    value: "microsite",
    label: "Microsite & Branding",
    icon: Globe,
    showCompleteStatus: true,
  },
];

export default function CohortContent({ data }: Props) {
  return (
    <section className="space-y-6 w-full">
      <div className="flex items-center gap-2 justify-between">
        <h2 className="text-lg font-semibold">Cohort Content</h2>
        <Link
          href={`${process.env.NEXT_PUBLIC_MICROSITE_PREVIEW_DOMAIN}/preview/${data.cohort_key}`}
          target="_blank"
          className={buttonVariants({ variant: "outlineAccent" })}
        >
          Preview Microsite
        </Link>
      </div>
      <Tabs defaultValue={"overview"} className="w-full">
        <div className="bg-background rounded-lg px-4 border py-3">
          <TabsList className="w-full grid grid-cols-9 gap-1 bg-transparent h-auto p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                disabled={data.status === "DRAFT" && tab.value !== "overview"}
                key={tab.value}
                value={tab.value}
                className="flex flex-col items-center gap-2 py-3 px-2 data-[state=active]:bg-sidebar-accent/40 data-[state=active]:text-primary relative hover:bg-accent text-muted-foreground transition-all duration-200 rounded-md"
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
          <TabsContent value="overview" className={`mt-0`}>
            <CohortOverview data={data} />
          </TabsContent>
          {data.status !== "DRAFT" ? (
            <>
              <TabsContent value="media" className="mt-0">
                <CohortContentMedia data={data} />
              </TabsContent>
              <TabsContent value="faculty" className="mt-0">
                <CohortContentFaculty data={data} />
              </TabsContent>
              <TabsContent value="experts" className="mt-0">
                <CohortContentIndustryExperts data={data} />
              </TabsContent>
              <TabsContent value="certification" className="mt-0">
                <CohortCertification data={data} />
              </TabsContent>
              <TabsContent value="statistics" className="mt-0">
                <CohortStatistics data={data} />
              </TabsContent>
              <TabsContent value="testimonials" className="mt-0">
                <CohortContentTestimonials data={data} />
              </TabsContent>
              <TabsContent value="custom" className="mt-0">
                <CohortContentCustomSections data={data} />
              </TabsContent>

              <TabsContent value="microsite" className="mt-0">
                <CohortContentMicrosite
                  data={data}
                  previewDomain={
                    process.env.NEXT_PUBLIC_MICROSITE_PREVIEW_DOMAIN || ""
                  }
                />
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
  const isDesignOverviewSectionCompleted =
    !!data.overview_section &&
    !!data.overview_section.title &&
    !!data.overview_section.description;

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
