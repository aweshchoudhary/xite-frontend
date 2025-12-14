import { PrimaryDB } from "@/modules/common/database/prisma/types";
import MicrositeAdditionalFieldsView from "../../common/components/microsite-additional-fields-view";
import { ImageIcon, TableOfContentsIcon } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/modules/common/lib/utils";
import {
  CohortSectionWithData,
  GetCohort,
  GetCohortSectionOrderBySectionIdOutput,
  getCohortSectionOrderBySectionId,
  getCohortSections,
} from "@/modules/cohort/server/cohort/read";
import { useEffect, useState } from "react";

type Props = {
  data?: PrimaryDB.CohortGenericSectionGetPayload<object>[];
  cohortData: GetCohort;
};

export default function CohortContentDetailsOverviewView({
  data,
  cohortData,
}: Props) {
  return (
    <div>
      {data?.map((section, index) => (
        <CustomSectionView
          key={section.id}
          section={section}
          index={index}
          cohortData={cohortData}
        />
      ))}
      {data?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
          <TableOfContentsIcon className="size-8 mx-auto mb-2 opacity-50" />
          <p>No custom sections added yet</p>
          <p className="text-sm">
            Click the <code>edit</code> button to add custom sections
          </p>
        </div>
      )}
    </div>
  );
}

const CustomSectionView = ({
  section,
  index,
  cohortData,
}: {
  section: PrimaryDB.CohortGenericSectionGetPayload<object>;
  index: number;
  cohortData: GetCohort;
}) => {
  const [cohortSections, setCohortSections] = useState<CohortSectionWithData[]>(
    []
  );

  const [sectionOrder, setSectionOrder] =
    useState<GetCohortSectionOrderBySectionIdOutput | null>(null);

  useEffect(() => {
    const fetchCohortSections = async () => {
      const cohortSections = await getCohortSections(cohortData.id);
      setCohortSections(cohortSections);

      const sectionOrder = await getCohortSectionOrderBySectionId(section.id);
      setSectionOrder(sectionOrder);
    };
    fetchCohortSections();
  }, [cohortData.id]);

  return (
    <div className="p-5 border rounded-lg mt-3">
      <h3 className="text-lg font-semibold mb-2">
        Section #{index + 1}: {section.title}
      </h3>
      <div className="flex gap-10">
        <div className="md:w-1/4 shrink-0">
          <div className="aspect-square w-full rounded-lg overflow-hidden bg-muted/50 border">
            {section.banner_image_url ? (
              <Image
                src={getImageUrl(section.banner_image_url)}
                alt={section.title}
                width={300}
                height={300}
                className="w-full h-full aspect-square object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <ImageIcon
                  className="size-15 text-muted-foreground"
                  strokeWidth={1}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="p-5 bg-muted/50 rounded-lg mb-7">
            Section Position:{" "}
            <strong>
              {cohortSections.find(
                (sec) =>
                  sec.section_position ===
                  (sectionOrder?.section_position ?? 0) - 1
              )?.data.title
                ? `After ${
                    cohortSections.find(
                      (sec) =>
                        sec.section_position ===
                        (sectionOrder?.section_position ?? 0) - 1
                    )?.data.title
                  }`
                : "First Section"}
            </strong>
          </div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                section.description ||
                "Click on the Edit button to start adding Program Overview",
            }}
          />
          <br />
          <br />
          <MicrositeAdditionalFieldsView
            top_desc={section.top_description || ""}
            bottom_desc={section.bottom_description || ""}
          />
        </div>
      </div>
    </div>
  );
};
