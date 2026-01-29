"use client";

import type { GetCohortForDetailPage as GetCohort } from "@/modules/cohort/components/forms/read/get-one-for-detail-page-action";
import { Container as OverviewContainer } from "./overview/container";
import { Container as CurriculumContainer } from "./curriculum/container";
import { Container as BenefitsContainer } from "./benefits/container";
import { Container as WhoShouldApplyContainer } from "./who-should-apply/container";
import { Container as FacultyContainer } from "./faculty/container";
import { Container as IndustryExpertsContainer } from "./industry-experts/container";
import CohortContentMedia from "./media";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Users,
  Target,
  Briefcase,
  UserCheck,
  Image,
} from "lucide-react";
import { useState } from "react";

const CORE_SECTIONS = [
  { value: "overview", label: "Program Overview", icon: BookOpen },
  { value: "curriculum", label: "Curriculum", icon: GraduationCap },
  { value: "benefits", label: "Benefits", icon: Target },
  { value: "faculty", label: "Faculty", icon: Users },
  { value: "industry-experts", label: "Industry Experts", icon: Briefcase },
  { value: "who-should-apply", label: "Who Should Apply", icon: UserCheck },
  { value: "media", label: "Media", icon: Image },
] as const;

type SectionValue = (typeof CORE_SECTIONS)[number]["value"];

type Props = {
  data: GetCohort;
};

export default function CohortDetails({ data }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [section, setSection] = useState<SectionValue>("overview");

  const onSectionChange = (value: string) => {
    setSection(value as SectionValue);
    // get current query params
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("section", value);
    router.push(`${pathname}?${queryParams.toString()}`);
  };

  return (
    <div className="space-y-6 w-full">
      <Tabs
        value={section}
        onValueChange={onSectionChange}
        className="w-full"
      >
        <TabsList variant="line" className="w-full flex flex-wrap h-auto gap-x-3 gap-y-5">
          {CORE_SECTIONS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="gap-1.5 text-base w-fit! capitalize data-[state=active]:font-medium"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="mt-0">
           
              <OverviewContainer data={data} />
          </TabsContent>
          <TabsContent value="curriculum" className="mt-0">
              <CurriculumContainer data={data} />
          </TabsContent>
          <TabsContent value="benefits" className="mt-0">
           
              <BenefitsContainer data={data} />
          </TabsContent>
          <TabsContent value="faculty" className="mt-0">
           
              <FacultyContainer data={data} />
          </TabsContent>
          <TabsContent value="industry-experts" className="mt-0">
           
              <IndustryExpertsContainer data={data} />
          </TabsContent>
          <TabsContent value="who-should-apply" className="mt-0">
           
              <WhoShouldApplyContainer data={data} />
          </TabsContent>
          <TabsContent value="media" className="mt-0">
           
              <CohortContentMedia data={data} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
